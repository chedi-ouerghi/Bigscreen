import { ArrowLeft, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { fetchAnswersByToken } from '../services/api';

interface AnsweredQuestion {
  question_text: string;
  question_type: string;
  answer_text: string | null;
  answer_numeric: number | null;
  answer_json: any;
}

const ResultPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AnsweredQuestion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          setError("Token manquant ou invalide.");
          setLoading(false);
          return;
        }
        const data = await fetchAnswersByToken(token);
        setSurveyTitle(data.survey_title);
        setCompletedAt(data.completed_at);
        setQuestions(data.questions);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Aucune réponse trouvée pour ce token.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 shadow-card text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erreur</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au sondage
          </Button>
        </Card>
      </div>
    );
  }

  const completedDate = completedAt ? new Date(completedAt).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="min-h-screen bg-gradient-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 shadow-card mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Résultats du sondage</h1>
                <p className="text-muted-foreground">
                  <span className="font-mono font-semibold">{surveyTitle}</span>
                </p>
                {completedDate && (
                  <p className="text-sm text-muted-foreground">
                    Complété le {completedDate}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nouveau sondage
            </Button>
          </div>
        </Card>

        {/* Questions et réponses */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <Card key={index} className="p-6 shadow-soft animate-fade-in">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {q.question_text}
                  </h2>
                </div>
                <div className="ml-11">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    {q.question_type === 'single-choice' && 'Choix unique'}
                    {q.question_type === 'text' && 'Réponse texte'}
                    {q.question_type === 'numeric-scale' && 'Échelle (1-5)'}
                  </div>
                </div>
              </div>
              <div className="ml-11">
                <div className="p-4 border-2 border-dashed border-dashed-border rounded-lg bg-accent/30">
                  <p className="text-foreground font-medium">
                    {q.answer_text || q.answer_numeric || JSON.stringify(q.answer_json) || 'Aucune réponse'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Card className="p-6 shadow-card mt-8 text-center animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Merci d'avoir participé à notre sondage !
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="gradient"
              onClick={() => window.location.href = '/'}
            >
              Refaire le sondage
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
            >
              Imprimer les résultats
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultPage;