<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\BelongsTo;
    use Illuminate\Database\Eloquent\Relations\HasMany;

    class Question extends Model
    {
        use HasFactory;

        /**
         * The attributes that are mass assignable.
         *
         * @var array<int, string>
         */
        protected $fillable = [
            'survey_id',
            'question_number',
            'question_text',
            'question_type',
            'options',
            'validation_rules',
            'is_required',
        ];

        /**
         * The attributes that should be cast.
         *
         * @var array<string, string>
         */
        protected $casts = [
            'options' => 'array',
            'validation_rules' => 'array',
            'is_required' => 'boolean',
        ];

        /**
         * Get the survey that owns the question.
         */
        public function survey(): BelongsTo
        {
            return $this->belongsTo(Survey::class);
        }

        /**
         * Get the answers for the question.
         */
        public function answers(): HasMany
        {
            return $this->hasMany(Answer::class);
        }
    }