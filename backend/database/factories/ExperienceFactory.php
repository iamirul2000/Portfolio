<?php

namespace Database\Factories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Experience::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $technologies = ['Laravel', 'PHP', 'MySQL', 'Angular', 'TypeScript', 'Flutter', 'Swift', 'Java', 'REST APIs', 'Git', 'Docker'];
        $startDate = fake()->dateTimeBetween('-3 years', '-1 year');
        $isCurrent = fake()->boolean(20);
        $endDate = $isCurrent ? null : fake()->dateTimeBetween($startDate, 'now');

        return [
            'company_name' => fake()->company(),
            'role_title' => fake()->randomElement([
                'Full Stack Developer',
                'Backend Developer',
                'Frontend Developer',
                'Software Engineer',
                'Web Developer',
            ]),
            'location' => fake()->city(),
            'company_domain' => fake()->randomElement(['Fintech', 'E-commerce', 'Healthcare', 'Education', 'Technology', null]),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_current' => $isCurrent,
            'summary' => fake()->paragraphs(2, true),
            'highlights' => [
                fake()->sentence(),
                fake()->sentence(),
                fake()->sentence(),
            ],
            'technologies' => fake()->randomElements($technologies, fake()->numberBetween(3, 7)),
        ];
    }

    /**
     * Indicate that the experience is current.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_current' => true,
            'end_date' => null,
        ]);
    }

    /**
     * Indicate that the experience is past.
     */
    public function past(): static
    {
        $startDate = fake()->dateTimeBetween('-3 years', '-1 year');

        return $this->state(fn (array $attributes) => [
            'is_current' => false,
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, 'now'),
        ]);
    }
}
