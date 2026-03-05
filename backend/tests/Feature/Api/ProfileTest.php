<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_endpoint_returns_aggregated_data(): void
    {
        // Create test data
        Project::factory()->count(5)->create(['is_featured' => true]);
        Project::factory()->count(3)->create(['is_featured' => false]);

        Skill::factory()->create(['name' => 'Laravel', 'category' => 'Backend']);
        Skill::factory()->create(['name' => 'Angular', 'category' => 'Frontend']);

        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'name',
                    'title',
                    'summary',
                    'email',
                    'phone',
                    'github',
                    'linkedin',
                    'featured_projects' => [
                        '*' => [
                            'id',
                            'title',
                            'slug',
                            'description',
                            'technologies',
                            'thumbnail_url',
                        ],
                    ],
                    'skills_summary',
                ],
            ]);

        // Verify featured projects count (max 4)
        $this->assertLessThanOrEqual(4, count($response->json('data.featured_projects')));

        // Verify skills summary has categories
        $this->assertArrayHasKey('Backend', $response->json('data.skills_summary'));
        $this->assertArrayHasKey('Frontend', $response->json('data.skills_summary'));
    }

    public function test_profile_endpoint_includes_contact_information(): void
    {
        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Amirul Iman',
                    'email' => 'amirul.iman698@gmail.com',
                    'phone' => '0143123321',
                    'github' => 'https://github.com/iamirul2000',
                ],
            ]);
    }
}
