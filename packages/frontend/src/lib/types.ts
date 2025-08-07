export interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'single_choice' | 'scale' | 'text_input' | 'yes_no';
  options?: string[];
  display_order: number;
  is_active: boolean;
}

export interface QuestionnaireAnswer {
  question_id: string;
  answer: any;
}

export interface TherapistMatch {
  id: string;
  name: string;
  specialties: string[];
  therapeutic_approaches: string[];
  session_price: number;
  country: string;
  city: string;
  remote: boolean;
  on_site: boolean;
  bio: string;
  years_experience?: number;
  languages?: string[];
  match_score?: number;
  match_reason?: string;
  confidence_score?: number;
}

export interface ModelResult {
  model_name: string;
  display_name: string;
  matches: TherapistMatch[];
  processing_time_ms: number;
}

export interface ComparisonResults {
  comparison_id: string;
  results: ModelResult[];
}

export interface UserSelectionRequest {
  session_id: string;
  selected_therapist_id: string;
  feedback?: string;
}
