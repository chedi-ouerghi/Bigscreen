import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminService, api } from '@/services/api';
import { Filter, HelpCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Survey {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  max_responses?: number | null;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: number;
  survey_id: number;
  question_number: number;
  question_text: string;
  question_type: 'A' | 'B' | 'C';
  options?: string | null;
  validation_rules?: string | null;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

const questionTypeColors = {
  A: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  B: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  C: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

const questionTypeLabels = {
  A: 'Multiple Choice',
  B: 'Text Response',
  C: 'Rating Scale',
};

export default function Questions() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchQuestions(selectedSurvey.id);
    } else {
      setQuestions([]);
    }
  }, [selectedSurvey]);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedType]);

  const fetchSurveys = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getSurveys();
      setSurveys(response.data);
      if (response.data.length > 0) {
        setSelectedSurvey(response.data[0]);
      }
    } catch (error: any) {
      setError("Erreur lors du chargement des surveys.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (surveyId: number) => {
    try {
      setIsLoading(true);
      setError('');
      // Utilise l'API REST admin pour les questions d'un survey
      const response = await api.get(`/admin/surveys/${surveyId}/questions`);
      setQuestions(response.data);
    } catch (error: any) {
      setError("Erreur lors du chargement des questions.");
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;
    if (searchTerm) {
      filtered = filtered.filter(
        question =>
          question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.question_number.toString().includes(searchTerm)
      );
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(question => question.question_type === selectedType);
    }
    setFilteredQuestions(filtered);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-96"></div>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-8"></div>
                <div className="h-4 bg-slate-200 rounded flex-1"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Surveys selector */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Liste des Sondages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="flex flex-wrap gap-2 mb-2">
            {surveys.map((survey) => (
              <Button
                key={survey.id}
                variant={selectedSurvey?.id === survey.id ? 'default' : 'outline'}
                onClick={() => setSelectedSurvey(survey)}
                size="sm"
              >
                {survey.title}
              </Button>
            ))}
          </div>
          {selectedSurvey && (
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <b>Titre :</b> {selectedSurvey.title}<br />
              <b>Description :</b> {selectedSurvey.description}<br />
              <b>Actif :</b> {selectedSurvey.is_active ? 'Oui' : 'Non'}<br />
              <b>Max réponses :</b> {selectedSurvey.max_responses ?? 'Illimité'}<br />
              <b>Créé le :</b> {new Date(selectedSurvey.created_at).toLocaleString()}<br />
              <b>Mis à jour le :</b> {new Date(selectedSurvey.updated_at).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres & Recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Recherche questions ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                Tous types
              </Button>
              <Button
                variant={selectedType === 'A' ? 'default' : 'outline'}
                onClick={() => setSelectedType('A')}
                size="sm"
              >
                Type A
              </Button>
              <Button
                variant={selectedType === 'B' ? 'default' : 'outline'}
                onClick={() => setSelectedType('B')}
                size="sm"
              >
                Type B
              </Button>
              <Button
                variant={selectedType === 'C' ? 'default' : 'outline'}
                onClick={() => setSelectedType('C')}
                size="sm"
              >
                Type C
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Questions du Sondage</span>
          </CardTitle>
          <CardDescription>
            {selectedSurvey ? (
              <>Affichage de {filteredQuestions.length} questions sur {questions.length} pour <b>{selectedSurvey.title}</b></>
            ) : (
              <>Aucun sondage sélectionné</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}
          <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="w-20 font-semibold">No.</TableHead>
                  <TableHead className="font-semibold">Texte</TableHead>
                  <TableHead className="w-32 font-semibold">Type</TableHead>
                  <TableHead className="w-40 font-semibold">Options</TableHead>
                  <TableHead className="w-24 font-semibold">Obligatoire</TableHead>
                  <TableHead className="w-40 font-semibold">Créé le</TableHead>
                  <TableHead className="w-40 font-semibold">MAJ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => {
                  return (
                    <TableRow 
                      key={question.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        #{question.question_number}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {question.question_text}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={questionTypeColors[question.question_type]}
                        >
                          {question.question_type} - {questionTypeLabels[question.question_type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {question.options ? (typeof question.options === 'string' ? question.options : JSON.stringify(question.options)) : '-'}
                      </TableCell>
                  
                      <TableCell>
                        <Badge 
                          variant={question.is_required ? "destructive" : "secondary"}
                          className={question.is_required 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                          }
                        >
                          {question.is_required ? 'Oui' : 'Non'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(question.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(question.updated_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Essayez d'ajuster vos critères de recherche ou filtres.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}