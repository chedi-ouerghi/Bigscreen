<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'survey_id' => Survey::factory(),
            'question_text' => $this->faker->sentence . '?',
            'question_type' => $this->faker->randomElement(['A', 'B', 'C']),
            'question_number' => $this->faker->unique()->numberBetween(1, 20),
            'is_required' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
