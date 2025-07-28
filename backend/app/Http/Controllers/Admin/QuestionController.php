<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Survey;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Survey $survey)
    {
        return $survey->questions;
    }

    public function store(Request $request, Survey $survey)
    {
        $messages = [
            'question_number.required' => 'Le numéro de la question est obligatoire.',
            'question_number.integer' => 'Le numéro de la question doit être un entier.',
            'question_text.required' => 'Le texte de la question est obligatoire.',
            'question_type.required' => 'Le type de question est obligatoire.',
            'question_type.in' => 'Le type de question doit être A, B ou C.',
        ];
        $request->validate([
            'question_number' => 'required|integer',
            'question_text' => 'required|string',
            'question_type' => 'required|in:A,B,C',
            'options' => 'nullable|json',
            'validation_rules' => 'nullable|json',
            'is_required' => 'boolean',
        ], $messages);
        try {
            $question = $survey->questions()->create($request->all());
        } catch (\Exception $e) {
            \Log::error('Erreur création question admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création de la question.'], 500);
        }
        return response()->json($question, 201);
    }

    public function show(Survey $survey, Question $question)
    {
        return $question;
    }

    public function update(Request $request, Survey $survey, Question $question)
    {
        $messages = [
            'question_number.integer' => 'Le numéro de la question doit être un entier.',
            'question_type.in' => 'Le type de question doit être A, B ou C.',
        ];
        $request->validate([
            'question_number' => 'integer',
            'question_text' => 'string',
            'question_type' => 'in:A,B,C',
            'options' => 'nullable|json',
            'validation_rules' => 'nullable|json',
            'is_required' => 'boolean',
        ], $messages);
        try {
            $question->update($request->all());
        } catch (\Exception $e) {
            \Log::error('Erreur modification question admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la modification de la question.'], 500);
        }
        return response()->json($question);
    }

    public function destroy(Survey $survey, Question $question)
    {
        try {
            $question->delete();
        } catch (\Exception $e) {
            \Log::error('Erreur suppression question admin : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression de la question.'], 500);
        }
        return response()->json(null, 204);
    }

    public function all()
    {
        return \App\Models\Question::orderBy('id')->get();
    }
}