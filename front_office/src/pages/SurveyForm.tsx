import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import QuestionStep from '../components/QuestionStep';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { fetchSurveyQuestions, fetchSurveys, submitSurveyResponse } from '../services/api';

interface Question {
  id: number;
  question_number: number;
  question_text: string;
  question_type: 'A' | 'B' | 'C';
  options?: string[];
  is_required: boolean;
  validation_rules?: {
    required?: boolean;
    email?: boolean;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  };
}

const SurveyForm: React.FC = () => {
  const [surveyId, setSurveyId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: number]: string | number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurvey = async () => {
      setLoading(true);
      try {
        const surveys = await fetchSurveys();
        if (surveys.length === 0) {
          toast({ title: "Aucun sondage disponible", description: "Aucun sondage actif n'a été trouvé." });
          setLoading(false);
          return;
        }
        setSurveyId(surveys[0].id);
        const qs = await fetchSurveyQuestions(surveys[0].id);
        setQuestions(
          qs.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
          }))
        );
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger le sondage." });
      } finally {
        setLoading(false);
      }
    };
    loadSurvey();
  }, [toast]);

  const handleAnswerChange = (value: string | number) => {
    const questionId = questions[currentQuestion].id;
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!surveyId) return;

    try {
      const answers = questions.map(q => {
        const answerValue = responses[q.id];
        const answerPayload: any = {
          question_id: q.id,
          answer_text: null,
          answer_numeric: null,
          answer_json: null
        };

        switch (q.question_type) {
          case 'A':
          case 'B':
            answerPayload.answer_text = answerValue as string;
            break;
          case 'C':
            answerPayload.answer_numeric = Number(answerValue);
            break;
        }
        return answerPayload;
      });

      const payload = { answers };
      const res = await submitSurveyResponse(surveyId, payload);
      setGeneratedToken(res.response_token);
      setIsCompleted(true);
      toast({ title: "Sondage complété ! 🎉", description: "Merci pour votre participation." });
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de la soumission du sondage." });
    }
  };

  const getCurrentResponse = () => {
    const questionId = questions[currentQuestion]?.id;
    return responses[questionId] || '';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Aucune question disponible.</div>;
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Merci !</h1>
          <p className="text-muted-foreground mb-6">
            Vous pouvez consulter vos réponses depuis le lien qui vous a été communiqué.
          </p>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/6 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/2 to-success/2 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-3xl p-10 shadow-elevated bg-gradient-card border-0 relative z-10 backdrop-blur-sm">
        <ProgressBar current={currentQuestion + 1} total={questions.length} />
        <QuestionStep
          question={questions[currentQuestion]}
          currentStep={currentQuestion + 1}
          totalSteps={questions.length}
          value={getCurrentResponse()}
          onChange={handleAnswerChange}
          onNext={handleNext}
          onPrev={currentQuestion > 0 ? handlePrev : undefined}
          isFirst={currentQuestion === 0}
          isLast={currentQuestion === questions.length - 1}
        />
      </Card>
    </div>
  );
};

export default SurveyForm;
