<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle admin login request.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'error' => [
                    'message' => 'Invalid credentials',
                ],
            ], 401);
        }

        $user = Auth::user();

        // Only regenerate session if it exists (for web/SPA requests)
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'data' => [
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    /**
     * Handle admin logout request.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        // Only invalidate session if it exists (for web/SPA requests)
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'data' => [
                'message' => 'Logged out successfully',
            ],
        ], 200);
    }

    /**
     * Get authenticated user information.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ], 200);
    }
}
