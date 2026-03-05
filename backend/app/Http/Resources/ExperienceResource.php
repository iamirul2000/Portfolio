<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'role_title' => $this->role_title,
            'location' => $this->location,
            'company_domain' => $this->company_domain,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => $this->is_current,
            'summary' => $this->summary,
            'highlights' => $this->highlights,
            'technologies' => $this->technologies,
        ];
    }
}
