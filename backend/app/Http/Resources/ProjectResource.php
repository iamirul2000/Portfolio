<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'role' => $this->role,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'highlights' => $this->highlights,
            'technologies' => $this->technologies,
            'repo_url' => $this->repo_url,
            'live_url' => $this->live_url,
            'thumbnail_url' => $this->thumbnail_url,
            'is_featured' => $this->is_featured,
        ];
    }
}
