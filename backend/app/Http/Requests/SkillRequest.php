<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['Backend', 'Frontend', 'Mobile', 'Database', 'Tools'])],
            'level' => ['nullable', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Expert'])],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
