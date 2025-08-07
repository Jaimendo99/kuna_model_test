import { Question, ComparisonResults, UserSelectionRequest } from './types';

const API_BASE = '/api';

export const api = {
  // Get all questions for the questionnaire
  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return response.json();
  },

  // Submit questionnaire and get session ID
  async submitQuestionnaire(email: string, answers: Record<string, any>): Promise<{ session_id: string }> {
    const response = await fetch(`${API_BASE}/submit-questionnaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, answers }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit questionnaire');
    }
    return response.json();
  },

  // Get results for a session
  async getResults(sessionId: string): Promise<ComparisonResults> {
    const response = await fetch(`${API_BASE}/results/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }
    return response.json();
  },

  // Submit therapist selection
  async selectTherapist(data: UserSelectionRequest): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/select-therapist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit selection');
    }
    return response.json();
  },

  // Register new therapist
  async registerTherapist(data: any): Promise<{ success: boolean; id: string }> {
    const response = await fetch(`${API_BASE}/register-therapist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register therapist');
    }
    return response.json();
  },
};
