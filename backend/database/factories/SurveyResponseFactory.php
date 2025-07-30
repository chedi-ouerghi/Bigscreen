<?php

namespace Database\Factories;

use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class SurveyResponseFactory extends Factory
{
    protected $model = SurveyResponse::class;

    public function definition(): array
    {
        return [
            'survey_id' => Survey::factory(),
            'email' => $this->faker->email,
            'response_token' => $this->faker->uuid,
            'ip_address' => $this->faker->ipv4,
            'user_agent' => $this->faker->userAgent,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
