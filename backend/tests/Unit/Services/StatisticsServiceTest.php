<?php

namespace Tests\Unit\Services;

use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Services\StatisticsService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StatisticsServiceTest extends TestCase
{
    use RefreshDatabase;

    private StatisticsService $statisticsService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->statisticsService = new StatisticsService();
    }

    public function test_get_dashboard_stats_returns_correct_counts(): void
    {
        // Clean database
        Survey::query()->delete();
        SurveyResponse::query()->delete();
        User::query()->delete();

        // Create exactly the data we want
        Survey::factory()->count(3)->create(['is_active' => true]);
        SurveyResponse::factory()->count(5)->create(['survey_id' => Survey::first()->id]);
        User::factory()->count(2)->create();

        $stats = $this->statisticsService->getDashboardStats();

        $this->assertIsArray($stats);
        $this->assertEquals(3, $stats['total_surveys']);
        $this->assertEquals(5, $stats['total_responses']);
        $this->assertEquals(2, $stats['total_users']);
    }

    public function test_get_dashboard_stats_returns_zero_counts_when_no_data(): void
    {
        $stats = $this->statisticsService->getDashboardStats();

        $this->assertIsArray($stats);
        $this->assertEquals(0, $stats['total_surveys']);
        $this->assertEquals(0, $stats['total_responses']);
        $this->assertEquals(0, $stats['total_users']);
    }
}
