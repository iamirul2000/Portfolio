<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ContactMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'subject' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'status' => fake()->randomElement(['new', 'read']),
            'ip_address' => fake()->ipv4(),
        ];
    }
}
