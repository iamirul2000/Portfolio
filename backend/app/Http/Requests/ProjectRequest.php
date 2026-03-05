<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Convert JSON strings to arrays for FormData submissions
        if ($this->has('highlights') && is_string($this->highlights)) {
            $this->merge([
                'highlights' => json_decode($this->highlights, true) ?? []
            ]);
        }

        if ($this->has('technologies') && is_string($this->technologies)) {
            $this->merge([
                'technologies' => json_decode($this->technologies, true) ?? []
            ]);
        }

        // Convert string boolean to actual boolean
        if ($this->has('is_featured')) {
            $this->merge([
                'is_featured' => filter_var($this->is_featured, FILTER_VALIDATE_BOOLEAN)
            ]);
        }
    }

    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('projects')->ignore($projectId),
            ],
            'description' => ['required', 'string'],
            'role' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'highlights' => ['required', 'array', 'min:1'],
            'highlights.*' => ['required', 'string'],
            'technologies' => ['required', 'array', 'min:1'],
            'technologies.*' => ['required', 'string'],
            'repo_url' => ['nullable', 'url', 'max:500'],
            'live_url' => ['nullable', 'url', 'max:500'],
            'thumbnail' => ['nullable', 'image', 'max:5120'], // 5MB
            'is_featured' => ['boolean'],
        ];
    }
}
