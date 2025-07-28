<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('response_id')->constrained('survey_responses')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->text('answer_text')->nullable();
            $table->tinyInteger('answer_numeric')->nullable();
            $table->json('answer_json')->nullable();
            $table->timestamps();

            $table->index('response_id', 'idx_answers_response');
            $table->index('question_id', 'idx_answers_question');
            $table->unique(['response_id', 'question_id'], 'unique_answer_per_question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
