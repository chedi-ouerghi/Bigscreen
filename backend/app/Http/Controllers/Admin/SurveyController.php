<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return Survey::all();
    }

    public function store(Request $request)
    {
        $messages = [
            'title.required' => 'Le titre du sondage est obligatoire.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',
            'is_active.boolean' => 'Le champ actif doit être vrai ou faux.',
            'max_responses.integer' => 'Le nombre maximal de réponses doit être un entier.',
        ];
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'max_responses' => 'nullable|integer',
        ], $messages);
        try {
            $survey = Survey::create($request->all());
        } catch (\Exception $e) {
            \Log::error('Erreur création sondage admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création du sondage.'], 500);
        }
        return response()->json($survey, 201);
    }

    public function show(Survey $survey)
    {
        return $survey;
    }

    public function update(Request $request, Survey $survey)
    {
        $messages = [
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',
            'is_active.boolean' => 'Le champ actif doit être vrai ou faux.',
            'max_responses.integer' => 'Le nombre maximal de réponses doit être un entier.',
        ];
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'max_responses' => 'nullable|integer',
        ], $messages);
        try {
            $survey->update($request->all());
        } catch (\Exception $e) {
            \Log::error('Erreur modification sondage admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la modification du sondage.'], 500);
        }
        return response()->json($survey);
    }

    public function destroy(Survey $survey)
    {
        try {
            $survey->delete();
        } catch (\Exception $e) {
            \Log::error('Erreur suppression sondage admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression du sondage.'], 500);
        }
        return response()->json(null, 204);
    }

    public function allResponses()
    {
        try {
            $responses = \App\Models\SurveyResponse::with(['answers.question'])
                ->orderBy('created_at', 'desc')
                ->get();
        } catch (\Exception $e) {
            \Log::error('Erreur récupération réponses admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des réponses.'], 500);
        }
        return response()->json($responses);
    }
}