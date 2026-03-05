<?php

namespace Tests\Feature\Api;

use App\Models\Experience;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExperienceTest extends TestCase
{
    use RefreshDatabase;

    public function test_experiences_index_returns_all_experiences(): void
    {
        Experience::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/experiences');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'company_name',
                        'role_title',
                        'location',
                        'company_domain',
                        'start_date',
                        'end_date',
                        'is_current',
                        'summary',
                        'highlights',
                        'technologies',
                    ],
                ],
            ]);

        $this->assertEquals(3, count($response->json('data')));
    }

    public function test_experiences_are_ordered_by_start_date_descending(): void
    {
        Experience::factory()->create([
            'company_name' => 'Company A',
            'start_date' => '2020-01-01',
        ]);
        Experience::factory()->create([
            'company_name' => 'Company B',
            'start_date' => '2023-01-01',
        ]);
        Experience::factory()->create([
            'company_name' => 'Company C',
            'start_date' => '2021-01-01',
        ]);

        $response = $this->getJson('/api/v1/experiences');

        $response->assertStatus(200);

        $experiences = $response->json('data');
        $this->assertEquals('Company B', $experiences[0]['company_name']);
        $this->assertEquals('Company C', $experiences[1]['company_name']);
        $this->assertEquals('Company A', $experiences[2]['company_name']);
    }

    public function test_current_experience_is_marked_correctly(): void
    {
        Experience::factory()->create([
            'is_current' => true,
            'end_date' => null,
        ]);
        Experience::factory()->create([
            'is_current' => false,
            'end_date' => '2023-12-31',
        ]);

        $response = $this->getJson('/api/v1/experiences');

        $response->assertStatus(200);

        $experiences = $response->json('data');
        $currentExperience = collect($experiences)->firstWhere('is_current', true);

        $this->assertNotNull($currentExperience);
        $this->assertNull($currentExperience['end_date']);
    }
}
