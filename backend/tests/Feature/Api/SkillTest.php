<?php

namespace Tests\Feature\Api;

use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillTest extends TestCase
{
    use RefreshDatabase;

    public function test_skills_index_returns_grouped_by_category(): void
    {
        Skill::factory()->create(['name' => 'Laravel', 'category' => 'Backend']);
        Skill::factory()->create(['name' => 'PHP', 'category' => 'Backend']);
        Skill::factory()->create(['name' => 'Angular', 'category' => 'Frontend']);
        Skill::factory()->create(['name' => 'Flutter', 'category' => 'Mobile']);

        $response = $this->getJson('/api/v1/skills');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'Backend' => [
                        '*' => [
                            'id',
                            'name',
                            'category',
                            'level',
                        ],
                    ],
                    'Frontend',
                    'Mobile',
                ],
            ]);

        $this->assertEquals(2, count($response->json('data.Backend')));
        $this->assertEquals(1, count($response->json('data.Frontend')));
        $this->assertEquals(1, count($response->json('data.Mobile')));
    }

    public function test_skills_are_ordered_within_categories(): void
    {
        Skill::factory()->create(['name' => 'Skill B', 'category' => 'Backend', 'order' => 2]);
        Skill::factory()->create(['name' => 'Skill A', 'category' => 'Backend', 'order' => 1]);
        Skill::factory()->create(['name' => 'Skill C', 'category' => 'Backend', 'order' => 3]);

        $response = $this->getJson('/api/v1/skills');

        $response->assertStatus(200);

        $backendSkills = $response->json('data.Backend');
        $this->assertEquals('Skill A', $backendSkills[0]['name']);
        $this->assertEquals('Skill B', $backendSkills[1]['name']);
        $this->assertEquals('Skill C', $backendSkills[2]['name']);
    }
}
