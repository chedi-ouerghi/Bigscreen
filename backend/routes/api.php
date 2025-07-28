<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\SurveyController as AdminSurveyController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\SurveyController as PublicSurveyController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\Admin\DashboardController;

// Auth Routes
Route::group([
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Admin Routes
Route::group([
    'prefix' => 'admin',
    'middleware' => 'auth:api'
], function () {
    // Surveys
    Route::get('surveys', [AdminSurveyController::class, 'index']);
    Route::post('surveys', [AdminSurveyController::class, 'store']);
    Route::get('surveys/{survey}', [AdminSurveyController::class, 'show']);
    Route::put('surveys/{survey}', [AdminSurveyController::class, 'update']);
    Route::delete('surveys/{survey}', [AdminSurveyController::class, 'destroy']);

    // Questions
    Route::get('surveys/{survey}/questions', [QuestionController::class, 'index']);
    Route::post('surveys/{survey}/questions', [QuestionController::class, 'store']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);
    // Liste globale des questions
    Route::get('questions', [QuestionController::class, 'all']);
    // Liste globale des réponses
    Route::get('responses', [AdminSurveyController::class, 'allResponses']);
});

// Public Routes
Route::get('surveys', [PublicSurveyController::class, 'index']);
Route::get('surveys/{survey}/questions', [PublicSurveyController::class, 'questions']);
Route::post('surveys/{survey}/responses', [ResponseController::class, 'store'])->middleware('throttle:10,1');
// Public route pour consulter les réponses via token unique
Route::get('answers/{response_token}', [ResponseController::class, 'showByToken'])->middleware('throttle:10,1');
