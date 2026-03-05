<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExperienceRequest;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use App\Services\ExperienceService;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function __construct(
        private ExperienceService $experienceService
    ) {}

    public function index(Request $request)
    {
        $experiences = Experience::orderBy('start_date', 'desc')
            ->paginate($request->input('per_page', 15));

        return ExperienceResource::collection($experiences);
    }

    public function store(ExperienceRequest $request)
    {
        $experience = $this->experienceService->create($request->validated());

        return new ExperienceResource($experience);
    }

    public function show(Experience $experience)
    {
        return new ExperienceResource($experience);
    }

    public function update(ExperienceRequest $request, Experience $experience)
    {
        $experience = $this->experienceService->update($experience, $request->validated());

        return new ExperienceResource($experience);
    }

    public function destroy(Experience $experience)
    {
        $this->experienceService->delete($experience);

        return response()->noContent();
    }
}
