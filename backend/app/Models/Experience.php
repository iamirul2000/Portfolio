<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'role_title',
        'location',
        'company_domain',
        'start_date',
        'end_date',
        'is_current',
        'summary',
        'highlights',
        'technologies',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'technologies' => 'array',
            'is_current' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Scope a query to only include current experiences.
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    /**
     * Scope a query to order experiences by start date descending.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('start_date', 'desc');
    }
}
