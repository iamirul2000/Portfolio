<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{
    public function create(array $data): Project
    {
        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Handle thumbnail upload
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
            $data['thumbnail_path'] = $this->uploadThumbnail($data['thumbnail']);
            unset($data['thumbnail']);
        }

        return Project::create($data);
    }

    public function update(Project $project, array $data): Project
    {
        // Update slug if title changed and slug not explicitly provided
        if (isset($data['title']) && $data['title'] !== $project->title && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Handle thumbnail upload
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
            // Delete old thumbnail
            if ($project->thumbnail_path) {
                Storage::disk('public')->delete($project->thumbnail_path);
            }

            $data['thumbnail_path'] = $this->uploadThumbnail($data['thumbnail']);
            unset($data['thumbnail']);
        }

        $project->update($data);

        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        // Delete thumbnail
        if ($project->thumbnail_path) {
            Storage::disk('public')->delete($project->thumbnail_path);
        }

        $project->delete();
    }

    private function uploadThumbnail(UploadedFile $file): string
    {
        return $file->store('projects', 'public');
    }
}
