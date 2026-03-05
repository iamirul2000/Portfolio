<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_dashboard_returns_statistics(): void
    {
        // Create test data
        Project::factory()->count(3)->create();
        Experience::factory()->count(2)->create();
        Skill::factory()->count(5)->create();
        ContactMessage::factory()->count(4)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'projects_count',
                    'experiences_count',
                    'skills_count',
                    'unread_messages_count',
                    'recent_messages',
                ],
            ])
            ->assertJson([
                'data' => [
                    'projects_count' => 3,
                    'experiences_count' => 2,
                    'skills_count' => 5,
                    'unread_messages_count' => 4,
                ],
            ]);

        $this->assertCount(4, $response->json('data.recent_messages'));
    }

    public function test_dashboard_returns_only_recent_unread_messages(): void
    {
        // Create 10 new messages
        ContactMessage::factory()->count(10)->create(['status' => 'new']);

        // Create some read messages
        ContactMessage::factory()->count(3)->create(['status' => 'read']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200);

        // Should return only 5 most recent new messages
        $this->assertCount(5, $response->json('data.recent_messages'));

        // All returned messages should be new
        $messages = $response->json('data.recent_messages');
        foreach ($messages as $message) {
            $this->assertEquals('new', $message['status']);
        }
    }
}
