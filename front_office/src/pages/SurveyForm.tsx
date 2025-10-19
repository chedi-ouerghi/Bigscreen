import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import QuestionStep from "../components/QuestionStep";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { validateEmail } from "../utils/tokenUtils";
import {
  fetchSurveyQuestions,
  fetchSurveys,
  submitSurveyResponse,
} from "../services/api";

interface Question {
  id: number;
  question_number: number;
  question_text: string;
  question_type: "A" | "B" | "C";
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
  const [responses, setResponses] = useState<{
    [questionId: number]: string | number;
  }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurvey = async () => {
      setLoading(true);
      try {
        const surveys = await fetchSurveys();
        if (surveys.length === 0) {
          toast({
            title: "Aucun sondage disponible",
            description: "Aucun sondage actif n'a été trouvé.",
          });
          return;
        }
        setSurveyId(surveys[0].id);
        const qs = await fetchSurveyQuestions(surveys[0].id);
        setQuestions(
          qs.map((q) => ({
            ...q,
            options:
              typeof q.options === "string"
                ? JSON.parse(q.options)
                : q.options,
          }))
        );
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de charger le sondage.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadSurvey();
  }, [toast]);

  const handleAnswerChange = (value: string | number) => {
    const questionId = questions[currentQuestion].id;
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!surveyId) return;

    try {
      interface AnswerPayload {
        question_id: number;
        answer_text: string | null;
        answer_numeric: number | null;
        answer_json: object | null;
      }

      const answers: AnswerPayload[] = questions.map((q) => {
        const answerValue = responses[q.id];
        const answerPayload: AnswerPayload = {
          question_id: q.id,
          answer_text: null,
          answer_numeric: null,
          answer_json: null,
        };

        switch (q.question_type) {
          case "A":
          case "B":
            answerPayload.answer_text = answerValue as string;
            break;
          case "C":
            answerPayload.answer_numeric = Number(answerValue);
            break;
        }
        return answerPayload;
      });

      const payload: { answers: AnswerPayload[]; email?: string } = { answers };
      // Determine respondent email: prefer a question that asks for email
      const emailQuestion = questions.find((q) => {
        const vr = q.validation_rules as any;
        const emailFlag =
          vr &&
          (vr.email === true ||
            vr.email === "true" ||
            vr.email === 1 ||
            vr.email === "1");
        const text = (q.question_text || "").toLowerCase();
        const textSuggests =
          text.includes("email") || text.includes("e-mail") || text.includes("adresse");
        return emailFlag || textSuggests;
      });
      let email: string | undefined;

      if (emailQuestion) {
        // Use the response from the email question if present and valid.
        const candidate = (responses[emailQuestion.id] as string | undefined)?.trim();
        if (!candidate) {
          toast({
            title: "Email requis",
            description:
              "Le sondage contient un champ email. Veuillez revenir à la question email et renseigner votre adresse avant de soumettre.",
          });
          return;
        }
        if (!validateEmail(candidate)) {
          toast({
            title: "Email invalide",
            description: "L'email renseigné dans la question est invalide. Veuillez le corriger avant de soumettre.",
          });
          return;
        }
        email = candidate;
      } else {
        // Only prompt if no email question exists in the survey
        const prompted = window.prompt("Veuillez entrer votre adresse e-mail (requis) :");
        if (!prompted) {
          toast({
            title: "Email requis",
            description: "L'email est requis pour soumettre le sondage.",
          });
          return;
        }
        if (!validateEmail(prompted.trim())) {
          toast({
            title: "Email invalide",
            description: "Veuillez fournir une adresse e-mail valide.",
          });
          return;
        }
        email = prompted.trim();
      }

      // include email in payload
      payload.email = email;

      const res = await submitSurveyResponse(surveyId, payload);
      setGeneratedToken(res.response_token);
      setIsCompleted(true);
      toast({
        title: "Sondage complété ! 🎉",
        description: "Merci pour votre participation.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Erreur lors de la soumission du sondage.",
      });
    }
  };

  const getCurrentResponse = () => {
    const questionId = questions[currentQuestion]?.id;
    return responses[questionId] || "";
  };

  // while loading, don't render the form
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Chargement du sondage...
      </div>
    );

  // if not loading but no questions, show empty state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Aucune question disponible.
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Merci !</h1>
          <p className="text-muted-foreground mb-6">
            Vous pouvez consulter vos réponses depuis le lien qui vous a été
            communiqué.
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
<div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
  
  {/* Effets décoratifs */}
  <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />
  <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] bg-purple-300/10 rounded-full blur-2xl" />

  {/* Box des questions */}
  <div className="w-full max-w-3xl p-8 md:p-10 relative z-10 bg-white/80 border border-white/40 rounded-3xl shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.005]">
    
    {/* Glow subtil autour de la box */}
    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-50 -z-10" />

    {/* Petites animations décoratives */}
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />

    <div className="mb-8">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
    </div>

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
  </div>
</div>

  );
};

export default SurveyForm;
