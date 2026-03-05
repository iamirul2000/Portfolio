<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Current role at ABSS
        Experience::create([
            'company_name' => 'Asian Business Software Solutions (ABSS)',
            'role_title' => 'Full Stack Web Software Engineer',
            'location' => 'Malaysia',
            'company_domain' => 'Fintech',
            'start_date' => '2024-10-20',
            'end_date' => null,
            'is_current' => true,
            'summary' => 'Working on Angular frontend and Laravel backend, focusing on bug fixing, maintaining existing modules, and improving stability and performance. Collaborating with team to enhance application reliability.',
            'highlights' => [
                'Bug fixing and maintaining existing modules',
                'Improving stability and performance',
                'Collaborating with team to enhance application reliability',
                'Working with Angular and Laravel technologies',
            ],
            'technologies' => ['Angular', 'PHP', 'Laravel', 'MySQL', 'Git'],
        ]);

        // Previous role at Theta Edge Berhad
        Experience::create([
            'company_name' => 'Theta Edge Berhad',
            'role_title' => 'Full Stack Developer',
            'location' => 'Petaling Jaya',
            'company_domain' => 'Software Development',
            'start_date' => '2023-09-01',
            'end_date' => '2024-10-01',
            'is_current' => false,
            'summary' => 'Developed and maintained multiple full-stack applications including web systems, mobile apps, and payment terminals. Worked on PilgrimPro, SakuPay, and POSLite projects.',
            'highlights' => [
                'Developed PilgrimPro web system using Laravel and MySQL',
                'Maintained and updated SakuPay iOS application',
                'Built POSLite mobile app with Flutter and Android payment terminal',
                'Designed and normalized database schemas',
                'Integrated payment gateway SDKs',
            ],
            'technologies' => ['Laravel', 'PHP', 'MySQL', 'Swift', 'Flutter', 'Java', 'REST APIs'],
        ]);

        // Internship at TrackerHero
        Experience::create([
            'company_name' => 'TrackerHero',
            'role_title' => 'Back End Developer (Internship)',
            'location' => 'CyberJaya',
            'company_domain' => 'Technology',
            'start_date' => '2023-03-01',
            'end_date' => '2023-06-30',
            'is_current' => false,
            'summary' => 'Assisted developers with technical support and code reviews. Engaged with clients to gather requirements and provide project updates. Conducted testing from user and admin perspectives.',
            'highlights' => [
                'Provided technical support to development team',
                'Conducted code reviews and testing',
                'Gathered requirements from clients',
                'Performed user and admin perspective testing',
                'Collaborated on project updates and documentation',
            ],
            'technologies' => ['PHP', 'Laravel', 'MySQL', 'Git'],
        ]);
    }
}
