<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
