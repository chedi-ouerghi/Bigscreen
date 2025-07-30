import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import QuestionStep from '../components/QuestionStep';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { fetchSurveyQuestions, fetchSurveys, submitSurveyResponse } from '../services/api';
import { validateEmail } from '../utils/tokenUtils';

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
  const [email, setEmail] = useState('');
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
        // Correction ici :
        setQuestions(
          qs.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
          }))
        );
      } catch (e) {
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
    if (!validateEmail(email)) {
      toast({ title: "Email invalide", description: "Merci de saisir un email valide." });
      return;
    }
    if (!surveyId) return;
    
    try {
      const answers = questions.map(q => {
        const answerValue = responses[q.id];
        
        // Préparation de la réponse selon le type de question
        const answerPayload: any = {
          question_id: q.id,
          answer_text: null,
          answer_numeric: null,
          answer_json: null
        };

        switch (q.question_type) {
          case 'A': // Choix unique
            answerPayload.answer_text = answerValue as string;
            break;
          case 'B': // Texte
            answerPayload.answer_text = answerValue as string;
            break;
          case 'C': // Numérique
            answerPayload.answer_numeric = Number(answerValue);
            break;
        }

        return answerPayload;
      });

      const payload = { email, answers };
      const res = await submitSurveyResponse(surveyId, payload);
      setGeneratedToken(res.response_token);
      setIsCompleted(true);
      toast({ title: "Sondage complété ! 🎉", description: "Merci pour votre participation." });
    } catch (e) {
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
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
        </div>
        <Card className="w-full max-w-2xl p-10 shadow-elevated animate-bounce-in bg-gradient-card border-0 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <div className="relative mb-6">
                <CheckCircle className="w-24 h-24 text-success mx-auto animate-checkmark drop-shadow-lg" />
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-success/20 rounded-full animate-ping" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                Merci !
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Votre sondage a bien été soumis.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-subtle to-accent rounded-xl p-8 mb-8 border border-primary/10">
              <h2 className="text-xl font-bold text-foreground mb-4">Votre token de résultats</h2>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-primary/20">
                <div className="text-3xl font-mono font-bold text-primary mb-2 tracking-wider">
                  {generatedToken}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Gardez ce token pour consulter vos réponses à tout moment
              </p>
              <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-dashed border-primary/30 text-sm text-muted-foreground font-mono break-all">
                https://survey-client.vercel.app/result/{generatedToken}
              </div>
            </div>
            <div className="space-y-4">
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => window.location.href = `/result/${generatedToken}`}
                className="w-full"
              >
                Voir vos réponses
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Refaire le sondage
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/6 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/2 to-success/2 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-3xl p-10 shadow-elevated bg-gradient-card border-0 relative z-10 backdrop-blur-sm">
        <ProgressBar 
          current={currentQuestion + 1} 
          total={questions.length} 
        />
        {/* Champ email avant la première question */}
        {currentQuestion === 0 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Votre email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        )}
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