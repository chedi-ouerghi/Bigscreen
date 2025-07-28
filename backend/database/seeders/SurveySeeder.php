<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Survey;

class SurveySeeder extends Seeder
{
    public function run(): void
    {
        Survey::create([
            'title' => 'Sondage Bigscreen - Expérience Utilisateur',
            'description' => 'Ce sondage vise à comprendre l\'expérience utilisateur de Bigscreen et à identifier les améliorations possibles.',
            'is_active' => true,
        ]);
    }
}
