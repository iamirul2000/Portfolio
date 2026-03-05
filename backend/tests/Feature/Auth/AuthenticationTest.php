<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                ],
            ])
            ->assertJson([
                'data' => [
                    'user' => [
                        'email' => 'admin@test.com',
                        'name' => 'Test Admin',
                    ],
                ],
            ]);

        $this->assertAuthenticated();
    }

    public function test_user_cannot_login_with_invalid_email(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'wrong@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => [
                    'message' => 'Invalid credentials',
                ],
            ]);

        $this->assertGuest();
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => [
                    'message' => 'Invalid credentials',
                ],
            ]);

        $this->assertGuest();
    }

    public function test_login_requires_email(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_requires_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_requires_valid_email_format(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        // First login to get a proper session
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200);
        $this->assertAuthenticated();

        // Then logout
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'message' => 'Logged out successfully',
                ],
            ]);
    }

    public function test_authenticated_user_can_get_their_information(): void
    {
        $user = User::where('email', 'admin@test.com')->first();

        $response = $this->actingAs($user)
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                ],
            ])
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_logout(): void
    {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(401);
    }
}
