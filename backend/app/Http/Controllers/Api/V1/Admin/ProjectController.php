<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    public function index(Request $request)
    {
        $projects = Project::orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return ProjectResource::collection($projects);
    }

    public function store(ProjectRequest $request)
    {
        $project = $this->projectService->create($request->validated());

        return new ProjectResource($project);
    }

    public function show(Project $project)
    {
        return new ProjectResource($project);
    }

    public function update(ProjectRequest $request, Project $project)
    {
        $project = $this->projectService->update($project, $request->validated());

        return new ProjectResource($project);
    }

    public function destroy(Project $project)
    {
        $this->projectService->delete($project);

        return response()->noContent();
    }
}
