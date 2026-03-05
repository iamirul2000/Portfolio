<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('category')
            ->orderBy('order')
            ->get()
            ->groupBy('category')
            ->map(function ($categorySkills) {
                return SkillResource::collection($categorySkills);
            });

        return response()->json([
            'data' => $skills,
        ]);
    }
}
