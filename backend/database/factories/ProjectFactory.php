<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $technologies = ['Laravel', 'PHP', 'MySQL', 'Angular', 'TypeScript', 'Flutter', 'Swift', 'Java', 'REST APIs', 'Docker'];
        $startDate = fake()->dateTimeBetween('-2 years', '-6 months');
        $endDate = fake()->dateTimeBetween($startDate, 'now');

        return [
            'title' => fake()->words(3, true),
            'slug' => null, // Will be auto-generated from title
            'description' => fake()->paragraphs(3, true),
            'role' => fake()->randomElement(['Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'Mobile Developer']),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'highlights' => [
                fake()->sentence(),
                fake()->sentence(),
                fake()->sentence(),
            ],
            'technologies' => fake()->randomElements($technologies, fake()->numberBetween(3, 6)),
            'repo_url' => fake()->boolean(50) ? fake()->url() : null,
            'live_url' => fake()->boolean(30) ? fake()->url() : null,
            'thumbnail_path' => null,
            'is_featured' => fake()->boolean(30),
        ];
    }

    /**
     * Indicate that the project is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the project is not featured.
     */
    public function notFeatured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => false,
        ]);
    }
}
