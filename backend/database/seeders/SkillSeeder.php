<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Backend Skills
        $backendSkills = [
            ['name' => 'Laravel', 'level' => 'Advanced', 'order' => 1],
            ['name' => 'PHP', 'level' => 'Advanced', 'order' => 2],
            ['name' => 'REST APIs', 'level' => 'Advanced', 'order' => 3],
            ['name' => 'MySQL', 'level' => 'Advanced', 'order' => 4],
            ['name' => 'Database Optimization', 'level' => 'Intermediate', 'order' => 5],
        ];

        foreach ($backendSkills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => 'Backend',
                'level' => $skill['level'],
                'order' => $skill['order'],
            ]);
        }

        // Frontend Skills
        $frontendSkills = [
            ['name' => 'Angular', 'level' => 'Intermediate', 'order' => 1],
            ['name' => 'TypeScript', 'level' => 'Intermediate', 'order' => 2],
            ['name' => 'HTML', 'level' => 'Advanced', 'order' => 3],
            ['name' => 'CSS', 'level' => 'Advanced', 'order' => 4],
            ['name' => 'JavaScript', 'level' => 'Intermediate', 'order' => 5],
        ];

        foreach ($frontendSkills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => 'Frontend',
                'level' => $skill['level'],
                'order' => $skill['order'],
            ]);
        }

        // Mobile Skills
        $mobileSkills = [
            ['name' => 'Flutter', 'level' => 'Intermediate', 'order' => 1],
            ['name' => 'Swift', 'level' => 'Intermediate', 'order' => 2],
            ['name' => 'Java (Android)', 'level' => 'Intermediate', 'order' => 3],
        ];

        foreach ($mobileSkills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => 'Mobile',
                'level' => $skill['level'],
                'order' => $skill['order'],
            ]);
        }

        // Database Skills
        $databaseSkills = [
            ['name' => 'MySQL', 'level' => 'Advanced', 'order' => 1],
            ['name' => 'Database Design', 'level' => 'Intermediate', 'order' => 2],
        ];

        foreach ($databaseSkills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => 'Database',
                'level' => $skill['level'],
                'order' => $skill['order'],
            ]);
        }

        // Tools Skills
        $toolsSkills = [
            ['name' => 'Git', 'level' => 'Advanced', 'order' => 1],
            ['name' => 'GitHub', 'level' => 'Advanced', 'order' => 2],
            ['name' => 'Docker', 'level' => 'Intermediate', 'order' => 3],
            ['name' => 'Postman', 'level' => 'Intermediate', 'order' => 4],
            ['name' => 'Debugging', 'level' => 'Advanced', 'order' => 5],
            ['name' => 'Testing', 'level' => 'Intermediate', 'order' => 6],
            ['name' => 'Code Review', 'level' => 'Intermediate', 'order' => 7],
        ];

        foreach ($toolsSkills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'category' => 'Tools',
                'level' => $skill['level'],
                'order' => $skill['order'],
            ]);
        }
    }
}
