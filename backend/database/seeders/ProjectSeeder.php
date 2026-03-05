<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PilgrimPro
        Project::create([
            'title' => 'PilgrimPro',
            'slug' => 'pilgrimpro',
            'description' => 'Laravel-based web system for company operations and data management. Developed comprehensive database schema with normalization and optimization. Built RESTful APIs for frontend communication with focus on performance and scalability.',
            'role' => 'Full Stack Developer',
            'start_date' => '2023-09-01',
            'end_date' => '2024-10-01',
            'highlights' => [
                'Developed Laravel-based web system for company operations',
                'Designed and normalized database schema',
                'Built RESTful APIs for frontend communication',
                'Performed testing, debugging, and optimization',
                'Improved backend efficiency and scalability',
            ],
            'technologies' => ['Laravel', 'PHP', 'MySQL', 'REST APIs'],
            'repo_url' => null,
            'live_url' => null,
            'thumbnail_path' => null,
            'is_featured' => true,
        ]);

        // SakuPay
        Project::create([
            'title' => 'SakuPay',
            'slug' => 'sakupay',
            'description' => 'iOS mobile application for payment and donation services. Maintained and updated existing codebase, fixed bugs, and optimized performance. Improved UI responsiveness and developed payment and donation modules with focus on code maintainability.',
            'role' => 'iOS Developer',
            'start_date' => '2023-09-01',
            'end_date' => '2024-10-01',
            'highlights' => [
                'Maintained and updated existing iOS app',
                'Fixed bugs and optimized performance',
                'Improved UI responsiveness',
                'Developed payment and donation modules',
                'Refactored code for better maintainability',
            ],
            'technologies' => ['Swift', 'iOS SDK'],
            'repo_url' => null,
            'live_url' => null,
            'thumbnail_path' => null,
            'is_featured' => true,
        ]);

        // POSLite
        Project::create([
            'title' => 'POSLite',
            'slug' => 'poslite',
            'description' => 'Cross-platform mobile and terminal application for sales tracking. Built Flutter mobile app with API integrations and intuitive UI. Developed Android payment terminal app with Fiu Payment Gateway SDK integration. Implemented state management and real-time data synchronization.',
            'role' => 'Full Stack Mobile Developer',
            'start_date' => '2023-09-01',
            'end_date' => '2024-10-01',
            'highlights' => [
                'Built Flutter mobile app with API integrations',
                'Designed intuitive UI with Flutter widgets',
                'Implemented state management',
                'Developed Android payment terminal app',
                'Integrated Fiu Payment Gateway SDK',
                'Troubleshot API and data flow issues',
            ],
            'technologies' => ['Flutter', 'Java', 'Android SDK', 'Fiu Payment Gateway SDK'],
            'repo_url' => null,
            'live_url' => null,
            'thumbnail_path' => null,
            'is_featured' => true,
        ]);
    }
}
