<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        Storage::fake('public');
    }

    public function test_admin_can_list_projects(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/projects');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_project(): void
    {
        $this->markTestSkipped('GD extension not available in test environment');

        $thumbnail = UploadedFile::fake()->image('project.jpg');

        $data = [
            'title' => 'New Project',
            'description' => 'Project description',
            'role' => 'Full Stack Developer',
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-01',
            'highlights' => ['Achievement 1', 'Achievement 2'],
            'technologies' => ['Laravel', 'Angular'],
            'repo_url' => 'https://github.com/test/repo',
            'live_url' => 'https://example.com',
            'is_featured' => true,
            'thumbnail' => $thumbnail,
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/projects', $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'title' => 'New Project',
                'slug' => 'new-project',
            ]);

        $this->assertDatabaseHas('projects', [
            'title' => 'New Project',
            'slug' => 'new-project',
        ]);

        Storage::disk('public')->assertExists('projects/'.$thumbnail->hashName());
    }

    public function test_admin_can_view_single_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $project->id,
                'title' => $project->title,
            ]);
    }

    public function test_admin_can_update_project(): void
    {
        $project = Project::factory()->create(['title' => 'Old Title']);

        $data = [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'role' => 'Developer',
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-01',
            'highlights' => ['New achievement'],
            'technologies' => ['PHP'],
            'is_featured' => false,
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/projects/{$project->id}", $data);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Updated Title',
            ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_admin_can_delete_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/projects/{$project->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_project_creation_requires_authentication(): void
    {
        $data = [
            'title' => 'New Project',
            'description' => 'Description',
            'role' => 'Developer',
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-01',
            'highlights' => ['Achievement'],
            'technologies' => ['Laravel'],
            'is_featured' => true,
        ];

        $response = $this->postJson('/api/v1/admin/projects', $data);

        $response->assertStatus(401);
    }

    public function test_project_validation_fails_with_invalid_data(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/projects', [
                'title' => '', // Required
                'description' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'role', 'start_date', 'end_date', 'highlights', 'technologies']);
    }

    public function test_slug_is_auto_generated_from_title(): void
    {
        $data = [
            'title' => 'My Awesome Project',
            'description' => 'Description',
            'role' => 'Developer',
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-01',
            'highlights' => ['Achievement'],
            'technologies' => ['Laravel'],
            'is_featured' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/projects', $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'slug' => 'my-awesome-project',
            ]);
    }

    public function test_old_thumbnail_is_deleted_on_update(): void
    {
        $this->markTestSkipped('GD extension not available in test environment');

        $oldThumbnail = UploadedFile::fake()->image('old.jpg');
        $newThumbnail = UploadedFile::fake()->image('new.jpg');

        // Create project with thumbnail
        $project = Project::factory()->create();
        $oldPath = $oldThumbnail->store('projects', 'public');
        $project->update(['thumbnail_path' => $oldPath]);

        // Update with new thumbnail
        $data = [
            'title' => $project->title,
            'description' => $project->description,
            'role' => $project->role,
            'start_date' => $project->start_date->format('Y-m-d'),
            'end_date' => $project->end_date->format('Y-m-d'),
            'highlights' => $project->highlights,
            'technologies' => $project->technologies,
            'is_featured' => $project->is_featured,
            'thumbnail' => $newThumbnail,
        ];

        $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/projects/{$project->id}", $data);

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists('projects/'.$newThumbnail->hashName());
    }
}
