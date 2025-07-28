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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
            $table->unsignedTinyInteger('question_number');
            $table->text('question_text');
            $table->enum('question_type', ['A', 'B', 'C']);
            $table->json('options')->nullable();
            $table->json('validation_rules')->nullable();
            $table->boolean('is_required')->default(true);
            $table->timestamps();

            $table->index('survey_id', 'idx_questions_survey');
            $table->index('question_number', 'idx_questions_number');
            $table->unique(['survey_id', 'question_number'], 'unique_question_per_survey');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
