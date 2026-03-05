<?php

use App\Http\Controllers\Api\V1\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\ExperienceController as AdminExperienceController;
use App\Http\Controllers\Api\V1\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\V1\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\SkillController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public API routes (v1)
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    // Public routes
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store']);
});

// Admin API routes (v1) - Protected by Sanctum
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Projects CRUD
    Route::apiResource('projects', AdminProjectController::class);

    // Experiences CRUD
    Route::apiResource('experiences', AdminExperienceController::class);

    // Skills CRUD
    Route::apiResource('skills', AdminSkillController::class);

    // Contact Messages
    Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
    Route::get('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'show']);
    Route::patch('/contact-messages/{contactMessage}/status', [AdminContactMessageController::class, 'updateStatus']);
    Route::delete('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'destroy']);
});

// Legacy route for testing
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
