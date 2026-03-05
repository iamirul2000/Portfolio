<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExperienceRequest extends FormRequest
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
        if ($this->has('is_current')) {
            $this->merge([
                'is_current' => filter_var($this->is_current, FILTER_VALIDATE_BOOLEAN)
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'role_title' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'company_domain' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['boolean'],
            'summary' => ['required', 'string'],
            'highlights' => ['required', 'array', 'min:1'],
            'highlights.*' => ['required', 'string'],
            'technologies' => ['required', 'array', 'min:1'],
            'technologies.*' => ['required', 'string'],
        ];
    }
}
