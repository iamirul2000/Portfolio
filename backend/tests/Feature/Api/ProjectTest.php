<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_index_returns_paginated_list(): void
    {
        Project::factory()->count(20)->create();

        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                        'description',
                        'role',
                        'start_date',
                        'end_date',
                        'highlights',
                        'technologies',
                        'repo_url',
                        'live_url',
                        'thumbnail_url',
                        'is_featured',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);

        $data = $response->json('data');

        $this->assertCount(15, $data);
        $this->assertArrayHasKey('meta', $response->json());
    }

    public function test_projects_index_can_filter_by_featured(): void
    {
        Project::factory()->count(5)->create(['is_featured' => true]);
        Project::factory()->count(10)->create(['is_featured' => false]);

        $response = $this->getJson('/api/v1/projects?featured=1');

        $response->assertStatus(200);
        $this->assertEquals(5, count($response->json('data')));

        foreach ($response->json('data') as $project) {
            $this->assertTrue($project['is_featured']);
        }
    }

    public function test_projects_show_returns_single_project_by_slug(): void
    {
        $project = Project::factory()->create([
            'title' => 'Test Project',
            'slug' => 'test-project',
        ]);

        $response = $this->getJson('/api/v1/projects/test-project');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $project->id,
                    'title' => 'Test Project',
                    'slug' => 'test-project',
                ],
            ]);
    }

    public function test_projects_show_returns_404_for_invalid_slug(): void
    {
        $response = $this->getJson('/api/v1/projects/non-existent-slug');

        $response->assertStatus(404);
    }
}
