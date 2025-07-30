<?php

namespace Tests\Unit\Services;

use App\Models\Survey;
use App\Services\SurveyService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SurveyServiceTest extends TestCase
{
    use RefreshDatabase;

    private SurveyService $surveyService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->surveyService = new SurveyService();
    }

    public function test_get_active_surveys_returns_only_active_surveys(): void
    {
        // Create active surveys
        Survey::factory()->count(3)->create([
            'is_active' => true
        ]);

        // Create inactive surveys
        Survey::factory()->count(2)->create([
            'is_active' => false
        ]);

        $activeSurveys = $this->surveyService->getActiveSurveys();

        $this->assertCount(3, $activeSurveys);
        foreach ($activeSurveys as $survey) {
            $this->assertTrue($survey->is_active);
        }
    }

    public function test_get_active_surveys_returns_empty_collection_when_no_active_surveys(): void
    {
        // Create only inactive surveys
        Survey::factory()->count(2)->create([
            'is_active' => false
        ]);

        $activeSurveys = $this->surveyService->getActiveSurveys();

        $this->assertCount(0, $activeSurveys);
        $this->assertTrue($activeSurveys->isEmpty());
    }
}
