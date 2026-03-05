<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function __construct(
        private SkillService $skillService
    ) {}

    public function index(Request $request)
    {
        $skills = Skill::orderBy('category')
            ->orderBy('order')
            ->paginate($request->input('per_page', 50));

        return SkillResource::collection($skills);
    }

    public function store(SkillRequest $request)
    {
        $skill = $this->skillService->create($request->validated());

        return new SkillResource($skill);
    }

    public function show(Skill $skill)
    {
        return new SkillResource($skill);
    }

    public function update(SkillRequest $request, Skill $skill)
    {
        $skill = $this->skillService->update($skill, $request->validated());

        return new SkillResource($skill);
    }

    public function destroy(Skill $skill)
    {
        $this->skillService->delete($skill);

        return response()->noContent();
    }
}
