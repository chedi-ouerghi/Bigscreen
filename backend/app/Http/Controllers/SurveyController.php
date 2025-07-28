<?php

namespace App\Http\Controllers;

use App\Services\SurveyService;
use Illuminate\Http\Request;
use App\Models\Survey;

class SurveyController extends Controller
{
    protected $surveyService;

    public function __construct(SurveyService $surveyService)
    {
        $this->surveyService = $surveyService;
    }

    /**
     * Display a listing of the active surveys.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->surveyService->getActiveSurveys();
    }

    public function questions(Survey $survey)
    {
        // On retourne les questions triées par numéro de question
        return $survey->questions()->orderBy('question_number')->get();
    }
}