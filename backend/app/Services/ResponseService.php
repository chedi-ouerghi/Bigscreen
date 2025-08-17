<?php

namespace App\Services;

use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Mail\SurveyResponseConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        foreach ($data['answers'] as $answerData) {
            $response->answers()->create($answerData);
        }

        $response = $response->load('answers');

        // Send confirmation email with preview URL
        $frontendUrl = config('app.frontend_url', 'http://localhost:8080');
        $previewUrl = $frontendUrl . '/result/' . $response->response_token;
        
        try {
            Mail::to($response->email)->send(new SurveyResponseConfirmation($response, $previewUrl));
        } catch (\Exception $e) {
            \Log::warning('Failed to send confirmation email: ' . $e->getMessage());
        }

        return $response;
    }
}