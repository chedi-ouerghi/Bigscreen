import { Check, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { validateEmail } from '../utils/tokenUtils';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';

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
  value: string | number | null;
  onChange: (value: string | number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst = false,
  isLast = false,
  currentStep,
  totalSteps
}) => {
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const { toast } = useToast();
  const lastToastRef = useRef<string>('');

  // Valider immédiatement dès que l'utilisateur interagit
  useEffect(() => {
    if (touched) {
      validateAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, touched]);

  // Reset checkmark when changing question
  useEffect(() => {
    setShowCheckmark(false);
    setTouched(false);
    setError('');
  }, [question.id]);

  // Debug minimal
  useEffect(() => {
    if (touched) {
      console.debug(`[QuestionStep] q=${question.id} value=`, value, 'valid=', valid, 'error=', error);
    }
  }, [value, valid, error, touched, question.id]);

  // Notifier avec toast
  useEffect(() => {
    if (!touched) return;

    if (error) {
      if (lastToastRef.current !== error) {
        toast({ 
          title: `Question ${question.question_number}`, 
          description: error,
          variant: 'destructive'
        });
        lastToastRef.current = error;
      }
      return;
    }

    if (valid && lastToastRef.current && value !== null && value !== '' && value !== undefined) {
      toast({ 
        title: `Question ${question.question_number}`, 
        description: 'Réponse enregistrée' 
      });
      lastToastRef.current = '';
    }
  }, [error, valid, question.question_number, toast, touched, value]);

  const validateAnswer = (): boolean => {
    setError('');
    setValid(false);

    // Traiter 0 comme une valeur valide (pas vide)
    const isEmpty = value === null || value === '' || value === undefined;

    if (question.is_required && isEmpty) {
      setError('Ce champ est obligatoire');
      return false;
    }

    if (!question.is_required && isEmpty) {
      setValid(true);
      return true;
    }

    switch (question.question_type) {
      case 'A':
        if (question.is_required && isEmpty) {
          setError('Veuillez sélectionner une option');
          return false;
        }
        break;

      case 'B':
        const strValue = value === null || value === undefined ? '' : String(value);

        if (question.validation_rules?.email && !validateEmail(strValue)) {
          setError('Veuillez entrer une adresse email valide');
          return false;
        }

        if (question.validation_rules?.maxLength && strValue.length > question.validation_rules.maxLength) {
          setError(`Maximum ${question.validation_rules.maxLength} caractères autorisés`);
          return false;
        }
        break;

      case 'C': {
        if (isEmpty) {
          if (question.is_required) {
            setError('Veuillez sélectionner une valeur');
            return false;
          }
          setValid(true);
          return true;
        }

        // Convertir en nombre (accepter "0" ou 0)
        const numValue = Number(String(value).trim());
        
        if (isNaN(numValue)) {
          setError('Veuillez entrer un nombre valide (pas de caractères)');
          return false;
        }

        // Vérifier si c'est une question d'âge
        const qText = (question.question_text || '').toLowerCase();
        if (qText.includes('age') || qText.includes('âge')) {
          if (!Number.isInteger(numValue)) {
            setError("L'âge doit être un nombre entier");
            return false;
          }
        }

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
    setValid(true);
    return true;
  };

  // Add: timer ref + cleanup to avoid leaks and handleNext implementation
  const nextTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    // mark touched so validation messages appear
    setTouched(true);

    // validate synchronously
    const ok = validateAnswer();
    if (!ok) return;

    // show check animation briefly, then advance
    setShowCheckmark(true);
    nextTimerRef.current = window.setTimeout(() => {
      setShowCheckmark(false);
      if (onNext) onNext();
    }, 350);
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
      case 'A':
        if (!options || !Array.isArray(options)) {
          return (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700">Aucune option disponible pour cette question</p>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            {options.map((option, index) => (
              <label
                key={index}
                className={`
                  group flex items-center p-5 rounded-xl border-2 cursor-pointer
                  transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50
                  ${value === option 
                    ? 'border-blue-600 bg-blue-50 shadow-md' 
                    : 'border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => {
                    setTouched(true);
                    onChange(e.target.value);
                  }}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200
                  ${value === option 
                    ? 'border-blue-600 bg-blue-600 shadow-sm' 
                    : 'border-gray-400 group-hover:border-blue-500'
                  }
                `}>
                  {value === option && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span className={`text-base font-medium transition-colors ${
                  value === option ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'
                }`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'B':
        return (
          <div className="relative">
            <Input
              type={question.validation_rules?.email ? 'email' : 'text'}
              value={value as string || ''}
              onChange={(e) => {
                setTouched(true);
                onChange(e.target.value);
              }}
              onBlur={() => setTouched(true)}
              placeholder="Votre réponse..."
              className="border-2 border-gray-300 p-5 text-base focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-600 bg-white placeholder:text-gray-400 min-h-[3.5rem] text-black rounded-xl transition-all"
              maxLength={question.validation_rules?.maxLength}
            />
            {question.validation_rules?.maxLength && (
              <div className="absolute bottom-3 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                {(value as string)?.length || 0}/{question.validation_rules.maxLength}
              </div>
            )}
          </div>
        );

      case 'C':
        const minValue = question.validation_rules?.minValue || 1;
        const maxValue = question.validation_rules?.maxValue || 5;
        const scaleValues = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider mb-1 text-gray-500">Minimum</div>
                <div className="text-lg font-bold text-gray-800">{minValue}</div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider mb-1 text-gray-500">Maximum</div>
                <div className="text-lg font-bold text-gray-800">{maxValue}</div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {scaleValues.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    onChange(num);
                  }}
                  className={`
                    flex-1 h-16 rounded-xl border-2 transition-all duration-200
                    font-bold text-xl hover:scale-105 active:scale-95 shadow-sm
                    ${value === num
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-105'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            {value !== null && value !== '' && value !== undefined && (
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: typeof value === 'number' 
                      ? `${((value - minValue) / (maxValue - minValue)) * 100}%` 
                      : '0%'
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in" data-question-id={question.id}>
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Progress indicator */}
        {currentStep && totalSteps && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 max-w-16" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider px-4">
              Question {currentStep} sur {totalSteps}
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 max-w-16" />
          </div>
        )}

        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-base font-bold text-white">
              {question.question_number}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-snug">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </h3>
          </div>
          {valid && (
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
        
        <div className="mb-3">
          {renderQuestionContent()}
        </div>
        
        {error && touched && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-end">
          {valid && !error ? (
            <div className="flex items-center text-sm text-green-600 space-x-2">
              <Check className="w-4 h-4" />
              <span className="font-medium">Répondu</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Navigation Buttons */}
      {(onNext || onPrev) && (
        <div className="flex justify-between items-center mt-8">
          <div>
            {!isFirst && onPrev && (
              <Button 
                variant="outline" 
                onClick={onPrev}
                disabled={showCheckmark}
                className="min-w-28 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {showCheckmark && (
              <div className="animate-bounce">
                <div className="relative">
                  <Check className="w-8 h-8 text-green-500 drop-shadow-lg" />
                  <div className="absolute inset-0 w-8 h-8 bg-green-200 rounded-full animate-ping opacity-75" />
                </div>
              </div>
            )}
            {onNext && (
              <Button 
                variant="default"
                size="lg"
                onClick={handleNext}
                disabled={showCheckmark}
                className="min-w-32 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all"
              >
                {isLast ? 'Finaliser' : 'Continuer'}
                {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionStep;