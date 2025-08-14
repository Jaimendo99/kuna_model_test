from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


class QuestionnaireAnswer(BaseModel):
    question_id: str
    answer: Any  # Can be string, number, list, etc.


class UserQuestionnaire(BaseModel):
    email: EmailStr
    answers: Dict[str, Any]  # Changed from List to Dict for easier handling


class TherapistMatch(BaseModel):
    id: str
    name: str
    specialties: List[str]
    therapeutic_approaches: List[str]
    session_price: float
    country: str
    city: str
    remote: bool
    on_site: bool
    bio: str
    match_score: Optional[float] = None
    match_reason: Optional[str] = None
    confidence_score: Optional[float] = None  # Added confidence score


class ModelResultResponse(BaseModel):
    model_config = {"protected_namespaces": ()}

    model_name: str
    display_name: str  # Added display name for frontend
    matches: List[TherapistMatch]
    processing_time_ms: float


class ComparisonResponse(BaseModel):
    comparison_id: str
    results: List[ModelResultResponse]


class UserSelectionRequest(BaseModel):
    session_id: str  # Changed from comparison_id
    selected_therapist_id: str
    feedback: Optional[str] = None


class SubmitQuestionnaireRequest(BaseModel):
    email: EmailStr
    answers: Dict[str, Any]


class SubmitQuestionnaireResponse(BaseModel):
    session_id: str


class QuestionCreate(BaseModel):
    question_text: str
    question_type: str  # multiple_choice, scale, text_input, yes_no
    options: Optional[List[str]] = None
    display_order: int


class TherapistCreate(BaseModel):
    name: str
    professional_titles: Optional[str] = None
    professional_id_number: Optional[str] = None
    specialties: List[str]
    therapeutic_approaches: List[str]
    session_price: float
    price_negotiable: bool = False
    country: str
    city: str
    remote: bool = False
    on_site: bool = False
    hybrid: bool = False
    bio: str
    years_experience: int
    languages: List[str]
    therapeutic_style: List[str]
    age_groups: List[str]
    weekly_availability: Optional[str] = None
    commitment_level: Optional[str] = None
    additional_info: Optional[str] = None


class QuestionResponse(BaseModel):
    id: str
    question_text: str
    question_type: str
    options: Optional[List[str]]
    display_order: int
    is_active: bool


class TherapistResponse(BaseModel):
    id: str
    name: str
    professional_titles: Optional[str]
    professional_id_number: Optional[str]
    specialties: List[str]
    therapeutic_approaches: List[str]
    session_price: float
    price_negotiable: bool
    country: str
    city: str
    remote: bool
    on_site: bool
    hybrid: bool
    bio: str
    years_experience: int
    languages: List[str]
    therapeutic_style: List[str]
    age_groups: List[str]
    weekly_availability: Optional[str]
    commitment_level: Optional[str]
    additional_info: Optional[str]
    is_active: bool


class TherapistRegistrationRequest(BaseModel):
    name: str
    professional_titles: Optional[str] = None
    professional_id_number: Optional[str] = None
    email: EmailStr
    specialties: List[str]
    therapeutic_approaches: List[str]
    session_price: float
    price_negotiable: bool = False
    country: str
    city: str
    remote: bool
    on_site: bool
    hybrid: bool = False
    bio: str
    years_experience: int
    languages: List[str]
    therapeutic_style: List[str]
    age_groups: List[str]
    weekly_availability: Optional[str] = None
    commitment_level: Optional[str] = None
    additional_info: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]


class AdminUserResponse(BaseModel):
    email: str
    name: str
    role: str
