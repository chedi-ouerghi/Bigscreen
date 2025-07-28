<?php

namespace App\Services;

use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\User;

class StatisticsService
{
    public function getDashboardStats(): array
    {
        return [
            'total_surveys' => Survey::count(),
            'total_responses' => SurveyResponse::count(),
            'total_users' => User::count(),
        ];
    }
}