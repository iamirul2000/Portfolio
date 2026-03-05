<?php

namespace App\Services;

use App\Models\Experience;

class ExperienceService
{
    public function create(array $data): Experience
    {
        // If is_current is true, set end_date to null
        if (isset($data['is_current']) && $data['is_current']) {
            $data['end_date'] = null;
        }

        return Experience::create($data);
    }

    public function update(Experience $experience, array $data): Experience
    {
        // If is_current is true, set end_date to null
        if (isset($data['is_current']) && $data['is_current']) {
            $data['end_date'] = null;
        }

        $experience->update($data);

        return $experience->fresh();
    }

    public function delete(Experience $experience): void
    {
        $experience->delete();
    }
}
