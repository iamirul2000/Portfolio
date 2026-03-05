<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class SanctumConfigurationTest extends TestCase
{
    /**
     * Test that CSRF cookie endpoint is accessible.
     */
    public function test_csrf_cookie_endpoint_is_accessible(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');

        $response->assertStatus(204);
    }

    /**
     * Test that CSRF cookie is set after requesting the endpoint.
     */
    public function test_csrf_cookie_is_set(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');

        $response->assertStatus(204);
        $response->assertCookie('XSRF-TOKEN');
    }

    /**
     * Test that session cookie is set.
     */
    public function test_session_cookie_is_set(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');

        $response->assertStatus(204);

        // Check that a session cookie is set (name depends on APP_NAME)
        $cookies = $response->headers->getCookies();
        $sessionCookieExists = collect($cookies)->contains(function ($cookie) {
            return str_contains($cookie->getName(), 'session');
        });

        $this->assertTrue($sessionCookieExists, 'Session cookie should be set');
    }

    /**
     * Test that CORS headers are configured correctly.
     */
    public function test_cors_headers_allow_credentials(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:4200',
        ])->get('/sanctum/csrf-cookie');

        $response->assertStatus(204);
        $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        $response->assertHeader('Access-Control-Allow-Credentials', 'true');
    }
}
