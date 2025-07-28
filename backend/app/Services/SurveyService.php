<?php

namespace App\Services;

use App\Models\Survey;

class SurveyService
{
    /**
     * Get all active surveys.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveSurveys()
    {
        return Survey::where('is_active', true)->get();
    }
}