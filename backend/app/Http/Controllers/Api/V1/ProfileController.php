<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Skill;

class ProfileController extends Controller
{
    public function index()
    {
        $featuredProjects = Project::where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();

        $skillsByCategory = Skill::orderBy('category')
            ->orderBy('order')
            ->get()
            ->groupBy('category')
            ->map(function ($skills) {
                return $skills->pluck('name')->toArray();
            });

        return response()->json([
            'data' => [
                'name' => 'Amirul Iman',
                'title' => 'Full Stack Web Software Engineer',
                'summary' => 'Full Stack Developer with experience in Laravel, PHP, Angular, and mobile development. Passionate about building scalable web applications and clean code.',
                'email' => 'amirul.iman698@gmail.com',
                'phone' => '0143123321',
                'github' => 'https://github.com/iamirul2000',
                'linkedin' => 'www.linkedin.com/in/mirul-',
                'featured_projects' => ProjectResource::collection($featuredProjects),
                'skills_summary' => $skillsByCategory,
            ],
        ]);
    }
}
