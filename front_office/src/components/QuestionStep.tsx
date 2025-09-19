import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { validateEmail } from '../utils/tokenUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface QuestionStepProps {
  question: {
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
  };
  currentStep: number;
  totalSteps: number;
  value: string | number | null;
  onChange: (value: string | number) => void;
  onNext: () => void;
  onPrev?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  currentStep,
  totalSteps,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast
}) => {
  const [error, setError] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    setError('');
    setShowCheckmark(false);
  }, [currentStep]);

  const handleNext = () => {
    if (validateAnswer()) {
      setShowCheckmark(true);
      setTimeout(() => {
        onNext();
      }, 600);
    }
  };

  const validateAnswer = (): boolean => {
    // Validation pour les champs requis
    if (question.is_required && (value === null || value === '' || value === undefined)) {
      setError('Ce champ est requis');
      return false;
    }

    // Validation spécifique au type de question
    switch (question.question_type) {
      case 'A': // Type A (choix unique)
        if (question.is_required && !value) {
          setError('Veuillez sélectionner une option');
          return false;
        }
        break;

      case 'B': // Type B (texte)
        if (question.validation_rules?.email && !validateEmail(value as string)) {
          setError('Veuillez entrer une adresse email valide');
          return false;
        }
        if (question.validation_rules?.maxLength && (value as string).length > question.validation_rules.maxLength) {
          setError(`Maximum ${question.validation_rules.maxLength} caractères autorisés`);
          return false;
        }
        break;

      case 'C': { // Type C (échelle numérique)
        const numValue = Number(value);
        if (question.validation_rules?.minValue !== undefined && numValue < question.validation_rules.minValue) {
          setError(`La valeur minimale est ${question.validation_rules.minValue}`);
          return false;
        }
        if (question.validation_rules?.maxValue !== undefined && numValue > question.validation_rules.maxValue) {
          setError(`La valeur maximale est ${question.validation_rules.maxValue}`);
          return false;
        }
        break;
      }
    }

    setError('');
    return true;
  };

  const renderQuestionContent = () => {
    let options = question.options;
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        options = [];
      }
    }

    switch (question.question_type) {
      case 'A': // Choix unique (radio buttons)
        // Vérifier que options existe et est un tableau avant de mapper
        if (!options || !Array.isArray(options)) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700">Aucune option disponible pour cette question</p>
            </div>
          );
        }
  
        return (
          <div className="space-y-4">
            {options.map((option, index) => (
              <label
                key={index}
                className={`
                  group flex items-center p-6 rounded-xl border-2 border-dashed cursor-pointer
                  transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft
                  ${value === option 
                    ? 'border-primary bg-primary/10 shadow-card' 
                    : 'border-gray-300 hover:scale-[1.02]'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`
                  w-6 h-6 rounded-full border-2 mr-4 transition-all duration-300 flex items-center justify-center
                  ${value === option 
                    ? 'border-primary bg-primary shadow-glow' 
                    : 'border-gray-300 group-hover:border-primary'
                  }
                `}>
                  {value === option && (
                    <div className="w-3 h-3 rounded-full bg-white animate-bounce-in" />
                  )}
                </div>
                <span className="text-black font-medium group-hover:text-primary transition-colors duration-300">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );
  

      case 'B': // Texte libre (input text/email)
        return (
          <div className="relative">
            <Input
              type={question.validation_rules?.email ? 'email' : 'text'}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Votre réponse..."
              className="border-2 border-gray-300 p-6 text-lg focus-visible:ring-0 bg-white placeholder:text-gray-400 min-h-[3rem] text-black focus:border-primary focus:ring-0"
              maxLength={question.validation_rules?.maxLength}
            />
            {question.validation_rules?.maxLength && (
              <div className="absolute bottom-2 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {(value as string)?.length || 0}/{question.validation_rules.maxLength}
              </div>
            )}
          </div>
        );

      case 'C': // Échelle numérique (1-5 ou autre)
        const minValue = question.validation_rules?.minValue || 1;
        const maxValue = question.validation_rules?.maxValue || 5;
        const scaleValues = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Minimum</div>
                <div className="text-lg font-bold">{minValue}</div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Maximum</div>
                <div className="text-lg font-bold">{maxValue}</div>
              </div>
            </div>
            <div className="flex justify-between space-x-3">
              {scaleValues.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange(num)}
                  className={`
                    w-16 h-16 rounded-full border-2 transition-all duration-300
                    font-bold text-xl hover:scale-110 active:scale-95 shadow-soft hover:shadow-card
                    ${value === num
                      ? 'border-primary bg-primary text-white shadow-glow transform scale-110'
                      : 'border-gray-300 text-black hover:border-primary hover:bg-primary/5'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            {/* Visual connection line */}
            <div className="relative h-1 bg-gray-200 rounded-full mx-8">
              <div 
                className="absolute h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
                style={{ 
                  width: value && typeof value === 'number' 
                    ? `${((value - minValue) / (maxValue - minValue)) * 100}%` 
                    : '0%'
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Question Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-full mb-6 shadow-glow">
          <span className="text-xl font-bold text-white">
            {question.question_number}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-px bg-gradient-to-r from-primary to-primary-dark flex-1 max-w-16" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4">
            Question {question.question_number} sur {totalSteps}
          </span>
          <div className="h-px bg-gradient-to-r from-primary to-primary-dark flex-1 max-w-16" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight max-w-4xl mx-auto">
          {question.question_text}
        </h1>
      </div>
      
      {/* Question Content */}
      <div className="mb-10">
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
          {renderQuestionContent()}
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <p className="text-red-600 text-sm font-medium flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0" />
              {error}
            </p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div>
          {!isFirst && onPrev && (
            <Button 
              variant="outline" 
              onClick={onPrev}
              disabled={showCheckmark}
              className="min-w-24 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Précédent
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-6">
          {showCheckmark && (
            <div className="animate-checkmark">
              <div className="relative">
                <Check className="w-10 h-10 text-green-500 drop-shadow-lg" />
                <div className="absolute inset-0 w-10 h-10 bg-green-200 rounded-full animate-ping" />
              </div>
            </div>
          )}
          <Button 
            variant="default"
            size="lg"
            onClick={handleNext}
            disabled={showCheckmark}
            className="min-w-32 bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary-darker"
          >
            {isLast ? 'Finaliser le sondage' : 'Continuer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionStep;