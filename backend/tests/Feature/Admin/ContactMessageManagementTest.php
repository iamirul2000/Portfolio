<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_admin_can_list_contact_messages(): void
    {
        ContactMessage::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/contact-messages');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_admin_can_filter_messages_by_status(): void
    {
        ContactMessage::factory()->count(3)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/contact-messages?status=new');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $messages = $response->json('data');
        foreach ($messages as $message) {
            $this->assertEquals('new', $message['status']);
        }
    }

    public function test_admin_can_view_single_message(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'new']);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $message->id,
                'name' => $message->name,
            ]);
    }

    public function test_viewing_message_marks_it_as_read(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'new']);

        $this->actingAs($this->admin)
            ->getJson("/api/v1/admin/contact-messages/{$message->id}");

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'read',
        ]);
    }

    public function test_admin_can_update_message_status(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'read']);

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/status", [
                'status' => 'new',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'status' => 'new',
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'status' => 'new',
        ]);
    }

    public function test_admin_can_delete_message(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/contact-messages/{$message->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
        ]);
    }

    public function test_status_update_validates_status_value(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/admin/contact-messages/{$message->id}/status", [
                'status' => 'invalid',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_contact_messages_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/contact-messages');

        $response->assertStatus(401);
    }

    public function test_messages_are_ordered_by_created_at_desc(): void
    {
        $old = ContactMessage::factory()->create(['created_at' => now()->subDays(2)]);
        $recent = ContactMessage::factory()->create(['created_at' => now()]);
        $middle = ContactMessage::factory()->create(['created_at' => now()->subDay()]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/contact-messages');

        $response->assertStatus(200);

        $messages = $response->json('data');

        // Should be ordered: recent, middle, old
        $this->assertEquals($recent->id, $messages[0]['id']);
        $this->assertEquals($middle->id, $messages[1]['id']);
        $this->assertEquals($old->id, $messages[2]['id']);
    }

    public function test_filter_all_returns_all_messages(): void
    {
        ContactMessage::factory()->count(3)->create(['status' => 'new']);
        ContactMessage::factory()->count(2)->create(['status' => 'read']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/contact-messages?status=all');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }
}
