<?php

namespace App\Services;

use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\Request;

class ResponseService
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function createResponse(Survey $survey, array $data, Request $request): SurveyResponse
    {
        $response = $survey->responses()->create([
            'email' => $data['email'],
            'response_token' => $this->tokenService->generate(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        foreach ($data['answers'] as $answerData) {
            $response->answers()->create($answerData);
        }

        return $response->load('answers');
    }
}