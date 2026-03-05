<?php

namespace Tests\Feature\Admin;

use App\Models\Experience;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExperienceManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_admin_can_list_experiences(): void
    {
        Experience::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/experiences');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_experience(): void
    {
        $data = [
            'company_name' => 'Test Company',
            'role_title' => 'Software Engineer',
            'location' => 'Remote',
            'company_domain' => 'Technology',
            'start_date' => '2024-01-01',
            'end_date' => '2024-12-31',
            'is_current' => false,
            'summary' => 'Working on various projects',
            'highlights' => ['Achievement 1', 'Achievement 2'],
            'technologies' => ['Laravel', 'Vue.js'],
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/experiences', $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'company_name' => 'Test Company',
                'role_title' => 'Software Engineer',
            ]);

        $this->assertDatabaseHas('experiences', [
            'company_name' => 'Test Company',
            'role_title' => 'Software Engineer',
        ]);
    }

    public function test_admin_can_view_single_experience(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/experiences/{$experience->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $experience->id,
                'company_name' => $experience->company_name,
            ]);
    }

    public function test_admin_can_update_experience(): void
    {
        $experience = Experience::factory()->create(['company_name' => 'Old Company']);

        $data = [
            'company_name' => 'Updated Company',
            'role_title' => 'Senior Developer',
            'location' => 'New York',
            'start_date' => '2024-01-01',
            'end_date' => '2024-12-31',
            'is_current' => false,
            'summary' => 'Updated summary',
            'highlights' => ['New achievement'],
            'technologies' => ['PHP', 'JavaScript'],
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/experiences/{$experience->id}", $data);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'company_name' => 'Updated Company',
            ]);

        $this->assertDatabaseHas('experiences', [
            'id' => $experience->id,
            'company_name' => 'Updated Company',
        ]);
    }

    public function test_admin_can_delete_experience(): void
    {
        $experience = Experience::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/experiences/{$experience->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('experiences', [
            'id' => $experience->id,
        ]);
    }

    public function test_is_current_sets_end_date_to_null(): void
    {
        $data = [
            'company_name' => 'Current Company',
            'role_title' => 'Developer',
            'location' => 'Remote',
            'start_date' => '2024-01-01',
            'end_date' => '2024-12-31', // This should be ignored
            'is_current' => true,
            'summary' => 'Current role',
            'highlights' => ['Achievement'],
            'technologies' => ['Laravel'],
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/experiences', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('experiences', [
            'company_name' => 'Current Company',
            'is_current' => true,
            'end_date' => null,
        ]);
    }

    public function test_experience_validation_fails_with_invalid_data(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/experiences', [
                'company_name' => '', // Required
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['company_name', 'role_title', 'location', 'start_date', 'summary', 'highlights', 'technologies']);
    }

    public function test_experiences_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/experiences');

        $response->assertStatus(401);
    }
}
