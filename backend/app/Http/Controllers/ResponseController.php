<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    protected $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    public function store(Request $request, Survey $survey)
    {
        $messages = [
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être valide.',
            'answers.required' => 'Toutes les réponses sont obligatoires.',
            'answers.array' => 'Le format des réponses est invalide.',
            'answers.*.question_id.required' => 'Chaque réponse doit être associée à une question.',
            'answers.*.question_id.exists' => 'La question n\'existe pas.',
        ];
        $validated = $request->validate([
            'email' => 'required|email',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.answer_text' => 'nullable|string',
            'answers.*.answer_numeric' => 'nullable|integer',
            'answers.*.answer_json' => 'nullable|json',
        ], $messages);

        try {
            $response = $this->responseService->createResponse($survey, $validated, $request);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la réponse au sondage : ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la soumission du sondage. Veuillez réessayer plus tard.'
            ], 500);
        }

        return response()->json($response, 201);
    }

    public function showByToken($response_token)
    {
        $response = \App\Models\SurveyResponse::where('response_token', $response_token)
            ->with(['answers.question', 'survey'])
            ->first();
        if (!$response) {
            return response()->json(['message' => 'Réponse non trouvée'], 404);
        }
        // Construction d'une réponse sécurisée
        $result = [
            'survey_title' => $response->survey->title,
            'completed_at' => $response->completed_at,
            'questions' => $response->answers->map(function($answer) {
                return [
                    'question_text' => $answer->question->question_text,
                    'question_type' => $answer->question->question_type,
                    'answer_text' => $answer->answer_text,
                    'answer_numeric' => $answer->answer_numeric,
                    'answer_json' => $answer->answer_json,
                ];
            })->values(),
        ];
        return response()->json($result);
    }
}