import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // À adapter selon l'environnement

export const fetchSurveys = async () => {
  const { data } = await axios.get(`${API_BASE}/surveys`);
  return data;
};

export const fetchSurveyQuestions = async (surveyId: number | string) => {
  const { data } = await axios.get(`${API_BASE}/surveys/${surveyId}/questions`);
  return data;
};

export const submitSurveyResponse = async (surveyId: number | string, payload: any) => {
  const { data } = await axios.post(`${API_BASE}/surveys/${surveyId}/responses`, payload);
  return data;
};

export const fetchAnswersByToken = async (token: string) => {
  const { data } = await axios.get(`${API_BASE}/answers/${token}`);
  return data;
}; 