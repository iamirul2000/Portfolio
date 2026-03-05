<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $projects = $query->orderBy('created_at', 'desc')
            ->paginate(15);

        return new ProjectCollection($projects);
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        return new ProjectResource($project);
    }
}
