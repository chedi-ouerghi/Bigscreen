import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
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
import { adminService } from '@/services/api';
import { format } from 'date-fns';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Survey {
  id: number;
  title: string;
}

interface Response {
  id: number;
  survey_id: number;
  email: string;
  completed_at: string;
  is_completed: boolean;
  answers: Answer[];
  // Optionnel : survey?: Survey;
}

interface Answer {
  question_number: number;
  question_text: string;
  answer_text?: string;
  answer_numeric?: number;
  answer_json?: any;
  question_type: 'A' | 'B' | 'C';
}

export default function Responses() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSurveysAndResponses();
  }, []);

  useEffect(() => {
    filterResponses();
  }, [responses, searchTerm]);

  const fetchSurveysAndResponses = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [surveysRes, responsesRes] = await Promise.all([
        adminService.getSurveys(),
        adminService.getResponses(),
      ]);
      setSurveys(surveysRes.data);
      setResponses(responsesRes.data);
    } catch (error: any) {
      setError("Erreur lors du chargement des réponses ou des sondages.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterResponses = () => {
    let filtered = responses;
    if (searchTerm) {
      filtered = filtered.filter(
        response =>
          response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          response.answers.some(answer =>
            (answer.answer_text || '').toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredResponses(filtered);
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-48"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Réponses aux Sondages
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Visualisez et analysez les réponses utilisateurs à vos sondages Bigscreen
        </p>
      </div>

      {/* Search */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Recherche de réponses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Recherche par email ou contenu de réponse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Réponses individuelles</span>
          </CardTitle>
          <CardDescription>
            Affichage de {filteredResponses.length} réponses sur {responses.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}
          <Accordion type="single" collapsible className="space-y-4">
            {filteredResponses.map((response) => {
              const survey = surveys.find(s => s.id === response.survey_id);
              return (
                <AccordionItem 
                  key={response.id} 
                  value={`response-${response.id}`}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                          <span className="text-sm font-medium text-white">
                            {survey ? survey.title[0] : '?'}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {response.email}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {survey ? survey.title : 'Sondage inconnu'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {response.completed_at ? format(new Date(response.completed_at), 'dd/MM/yyyy HH:mm') : 'Non complété'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {response.is_completed ? 'Complété' : 'En cours'}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                            <TableHead className="w-16">Q#</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Réponse</TableHead>
                            <TableHead className="w-20">Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {response.answers.map((answer, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                #{answer.question_number}
                              </TableCell>
                              <TableCell className="text-slate-700 dark:text-slate-300">
                                {answer.question_text}
                              </TableCell>
                              <TableCell className="text-slate-900 dark:text-slate-100 font-medium">
                                {answer.answer_text ?? answer.answer_numeric ?? JSON.stringify(answer.answer_json) ?? '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  className={
                                    answer.question_type === 'A' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                    answer.question_type === 'B' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                  }
                                >
                                  {answer.question_type}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {filteredResponses.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Aucune réponse trouvée
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Essayez d'ajuster vos critères de recherche.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}