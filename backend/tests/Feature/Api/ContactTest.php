<?php

namespace Tests\Feature\Api;

use App\Jobs\SendContactNotification;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('contact-form:127.0.0.1');
    }

    public function test_contact_form_accepts_valid_submission(): void
    {
        Queue::fake();

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Job Opportunity',
            'message' => 'I would like to discuss a job opportunity with you.',
        ];

        $response = $this->postJson('/api/v1/contact', $data);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'message' => "Thank you for your message. I'll get back to you soon!",
                ],
            ]);

        // Verify message was stored
        $this->assertDatabaseHas('contact_messages', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Job Opportunity',
            'status' => 'new',
        ]);

        // Verify email job was queued
        Queue::assertPushed(SendContactNotification::class);
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/contact', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_contact_form_validates_email_format(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'subject' => 'Test',
            'message' => 'Test message',
        ];

        $response = $this->postJson('/api/v1/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_contact_form_enforces_rate_limiting(): void
    {
        Queue::fake();

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ];

        // Submit 5 times (should succeed)
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/v1/contact', $data);
            $response->assertStatus(201);
        }

        // 6th attempt should be rate limited
        $response = $this->postJson('/api/v1/contact', $data);
        $response->assertStatus(429)
            ->assertJson([
                'error' => [
                    'message' => 'Too many requests. Please try again later.',
                ],
            ]);
    }

    public function test_contact_message_stores_ip_address(): void
    {
        Queue::fake();

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ];

        $this->postJson('/api/v1/contact', $data);

        $message = ContactMessage::first();
        $this->assertNotNull($message->ip_address);
    }
}
