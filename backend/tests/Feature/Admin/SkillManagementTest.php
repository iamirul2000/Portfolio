<?php

namespace Tests\Feature\Admin;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_admin_can_list_skills(): void
    {
        Skill::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/skills');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_admin_can_create_skill(): void
    {
        $data = [
            'name' => 'Laravel',
            'category' => 'Backend',
            'level' => 'Advanced',
            'order' => 1,
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/skills', $data);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Laravel',
                'category' => 'Backend',
                'level' => 'Advanced',
            ]);

        $this->assertDatabaseHas('skills', [
            'name' => 'Laravel',
            'category' => 'Backend',
        ]);
    }

    public function test_admin_can_view_single_skill(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/skills/{$skill->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $skill->id,
                'name' => $skill->name,
            ]);
    }

    public function test_admin_can_update_skill(): void
    {
        $skill = Skill::factory()->create(['name' => 'Old Skill']);

        $data = [
            'name' => 'Updated Skill',
            'category' => 'Frontend',
            'level' => 'Expert',
            'order' => 5,
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/skills/{$skill->id}", $data);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Skill',
            ]);

        $this->assertDatabaseHas('skills', [
            'id' => $skill->id,
            'name' => 'Updated Skill',
        ]);
    }

    public function test_admin_can_delete_skill(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/skills/{$skill->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('skills', [
            'id' => $skill->id,
        ]);
    }

    public function test_skill_validation_requires_valid_category(): void
    {
        $data = [
            'name' => 'Test Skill',
            'category' => 'InvalidCategory', // Invalid
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/skills', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_skill_validation_requires_valid_level(): void
    {
        $data = [
            'name' => 'Test Skill',
            'category' => 'Backend',
            'level' => 'InvalidLevel', // Invalid
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/skills', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['level']);
    }

    public function test_skill_validation_fails_with_missing_required_fields(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/skills', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'category']);
    }

    public function test_skills_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/skills');

        $response->assertStatus(401);
    }

    public function test_skills_are_ordered_by_category_and_order(): void
    {
        Skill::factory()->create(['category' => 'Frontend', 'order' => 2]);
        Skill::factory()->create(['category' => 'Backend', 'order' => 1]);
        Skill::factory()->create(['category' => 'Backend', 'order' => 0]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/skills');

        $response->assertStatus(200);

        $skills = $response->json('data');

        // First should be Backend with order 0
        $this->assertEquals('Backend', $skills[0]['category']);
        $this->assertEquals(0, $skills[0]['order']);

        // Second should be Backend with order 1
        $this->assertEquals('Backend', $skills[1]['category']);
        $this->assertEquals(1, $skills[1]['order']);

        // Third should be Frontend
        $this->assertEquals('Frontend', $skills[2]['category']);
    }
}
