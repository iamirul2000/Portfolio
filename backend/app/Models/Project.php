<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'role',
        'start_date',
        'end_date',
        'highlights',
        'technologies',
        'repo_url',
        'live_url',
        'thumbnail_path',
        'is_featured',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['thumbnail_url'];

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
            'is_featured' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    /**
     * Get the thumbnail URL accessor.
     */
    public function getThumbnailUrlAttribute(): string
    {
        return $this->thumbnail_path
            ? asset('storage/'.$this->thumbnail_path)
            : 'https://via.placeholder.com/800x600';
    }

    /**
     * Scope a query to only include featured projects.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
