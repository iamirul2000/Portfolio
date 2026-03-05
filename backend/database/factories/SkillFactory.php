<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Skill::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Backend', 'Frontend', 'Mobile', 'Database', 'Tools'];
        $levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

        $skillsByCategory = [
            'Backend' => ['Laravel', 'PHP', 'Node.js', 'Python', 'Ruby', 'REST APIs'],
            'Frontend' => ['Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
            'Mobile' => ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Java'],
            'Database' => ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
            'Tools' => ['Git', 'Docker', 'GitHub', 'Postman', 'VS Code'],
        ];

        $category = fake()->randomElement($categories);
        $skillName = fake()->randomElement($skillsByCategory[$category]);

        return [
            'name' => $skillName,
            'category' => $category,
            'level' => fake()->randomElement($levels),
            'order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Indicate that the skill is in the Backend category.
     */
    public function backend(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Backend',
            'name' => fake()->randomElement(['Laravel', 'PHP', 'Node.js', 'Python', 'REST APIs']),
        ]);
    }

    /**
     * Indicate that the skill is in the Frontend category.
     */
    public function frontend(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Frontend',
            'name' => fake()->randomElement(['Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript']),
        ]);
    }

    /**
     * Indicate that the skill is in the Mobile category.
     */
    public function mobile(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Mobile',
            'name' => fake()->randomElement(['Flutter', 'Swift', 'Kotlin', 'React Native', 'Java']),
        ]);
    }

    /**
     * Indicate that the skill is in the Database category.
     */
    public function database(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Database',
            'name' => fake()->randomElement(['MySQL', 'PostgreSQL', 'MongoDB', 'Redis']),
        ]);
    }

    /**
     * Indicate that the skill is in the Tools category.
     */
    public function tools(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Tools',
            'name' => fake()->randomElement(['Git', 'Docker', 'GitHub', 'Postman', 'VS Code']),
        ]);
    }

    /**
     * Set the skill level to Expert.
     */
    public function expert(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => 'Expert',
        ]);
    }

    /**
     * Set the skill level to Advanced.
     */
    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => 'Advanced',
        ]);
    }
}
