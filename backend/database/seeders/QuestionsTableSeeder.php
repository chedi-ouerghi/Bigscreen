<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use App\Models\Survey;

class QuestionsTableSeeder extends Seeder
{
    public function run(): void
    {
        $survey = Survey::first();
        if (!$survey) {
            $survey = Survey::create([
                'title' => 'Sondage Bigscreen - Expérience Utilisateur',
                'description' => 'Ce sondage vise à comprendre l\'expérience utilisateur de Bigscreen et à identifier les améliorations possibles.',
                'is_active' => true,
            ]);
        }

        $questions = [
            [
                'survey_id' => $survey->id,
                'question_number' => 1,
                'question_text' => 'Votre adresse mail',
                'question_type' => 'B',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 2,
                'question_text' => 'Votre âge',
                'question_type' => 'B',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 3,
                'question_text' => 'Votre sexe',
                'question_type' => 'A',
                'options' => json_encode(['Homme', 'Femme', 'Préfère ne pas répondre']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 4,
                'question_text' => 'Nombre de personne dans votre foyer (adulte & enfants)',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 5,
                'question_text' => 'Votre profession',
                'question_type' => 'B',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 6,
                'question_text' => 'Quel marque de casque VR utilisez-vous ?',
                'question_type' => 'A',
                'options' => json_encode(['Oculus Quest', 'Oculus Rift/s', 'HTC Vive', 'Windows Mixed Reality', 'Valve index']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 7,
                'question_text' => 'Sur quel magasin d’application achetez vous des contenus VR ?',
                'question_type' => 'A',
                'options' => json_encode(['SteamVR', 'Occulus store', 'Viveport', 'Windows store']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 8,
                'question_text' => 'Quel casque envisagez-vous d’acheter dans un futur proche ?',
                'question_type' => 'A',
                'options' => json_encode(['Occulus Quest', 'Occulus Go', 'HTC Vive Pro', 'PSVR', 'Autre', 'Aucun']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 9,
                'question_text' => 'Au sein de votre foyer, combien de personnes utilisent votre casque VR pour regarder Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 10,
                'question_text' => 'Vous utilisez principalement Bigscreen pour :',
                'question_type' => 'A',
                'options' => json_encode(['regarder la TV en direct', 'regarder des films', 'travailler', 'jouer en solo', 'jouer en équipe']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 11,
                'question_text' => 'Combien donnez-vous de point pour la qualité de l’image sur Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 12,
                'question_text' => 'Combien donnez-vous de point pour le confort d’utilisation de l’interface Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 13,
                'question_text' => 'Combien donnez-vous de point pour la connexion réseau de Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 14,
                'question_text' => 'Combien donnez-vous de point pour la qualité des graphismes 3D dans Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 15,
                'question_text' => 'Combien donnez-vous de point pour la qualité audio dans Bigscreen ?',
                'question_type' => 'C',
                'options' => null,
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 16,
                'question_text' => 'Aimeriez-vous avoir des notifications plus précises au cours de vos sessions Bigscreen ?',
                'question_type' => 'A',
                'options' => json_encode(['Oui', 'Non']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 17,
                'question_text' => 'Aimeriez-vous pouvoir inviter un ami à rejoindre votre session via son smartphone ?',
                'question_type' => 'A',
                'options' => json_encode(['Oui', 'Non']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 18,
                'question_text' => 'Aimeriez-vous pouvoir enregistrer des émissions TV pour pouvoir les regarder ultérieurement ?',
                'question_type' => 'A',
                'options' => json_encode(['Oui', 'Non']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 19,
                'question_text' => 'Aimeriez-vous jouer à des jeux exclusifs sur votre Bigscreen ?',
                'question_type' => 'A',
                'options' => json_encode(['Oui', 'Non']),
                'is_required' => true
            ],
            [
                'survey_id' => $survey->id,
                'question_number' => 20,
                'question_text' => 'Quelle nouvelle fonctionnalité devrait exister sur Bigscreen ?',
                'question_type' => 'B',
                'options' => null,
                'is_required' => false
            ],
        ];
        
        foreach ($questions as $q) {
            Question::create($q);
        }
    }
} 