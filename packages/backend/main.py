from fastapi import FastAPI, HTTPException, Depends, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from typing import List
import uuid
import logging
import os
from datetime import timedelta

from database import get_db, init_db, Question, Therapist, ModelComparison, ModelResult, UserSelection
from schemas import (
    QuestionResponse, ComparisonResponse, UserSelectionRequest,
    SubmitQuestionnaireRequest, SubmitQuestionnaireResponse, ModelResultResponse,
    TherapistRegistrationRequest, LoginRequest, LoginResponse, AdminUserResponse
)
from gemini_service import GeminiMatchingService
from auth import authenticate_user, create_access_token, get_current_admin

app = FastAPI(title="Therapist Matching API", version="1.0.0")

# CORS configuration for different environments
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-domain.com",  # Replace with your actual domain
]

# Add additional origins from environment
if os.getenv("FRONTEND_URL"):
    ALLOWED_ORIGINS.append(os.getenv("FRONTEND_URL"))

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
init_db()

# Initialize Gemini service
gemini_service = GeminiMatchingService()


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    return {"status": "healthy", "service": "kuna-backend", "version": "1.0.0"}


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Kuna Therapist Matching API", "version": "1.0.0"}


# Authentication endpoints
@app.post("/api/admin/login", response_model=LoginResponse)
async def admin_login(email: str = Form(...), password: str = Form(...)):
    """Admin login endpoint"""
    try:
        user = authenticate_user(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(hours=24)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "email": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


@app.get("/api/admin/me", response_model=AdminUserResponse)
async def get_current_user(current_admin=Depends(get_current_admin)):
    """Get current authenticated admin user"""
    return AdminUserResponse(
        email=current_admin["email"],
        name=current_admin["name"],
        role=current_admin["role"]
    )


# Public endpoints (no authentication required)
@app.get("/api/questions", response_model=List[QuestionResponse])
async def get_questions(db: Session = Depends(get_db)):
    """Get all active questions for the questionnaire"""
    questions = db.query(Question).filter(
        Question.is_active == True).order_by(Question.display_order).all()
    return [
        QuestionResponse(
            id=q.id,
            question_text=q.question_text,
            question_type=q.question_type,
            options=q.options,
            display_order=q.display_order,
            is_active=q.is_active
        ) for q in questions
    ]


@app.post("/api/submit-questionnaire", response_model=SubmitQuestionnaireResponse)
async def submit_questionnaire(
    request: SubmitQuestionnaireRequest,
    db: Session = Depends(get_db)
):
    """Submit questionnaire and get session ID"""
    try:
        # Create comparison record
        comparison_id = str(uuid.uuid4())
        comparison = ModelComparison(
            id=comparison_id,
            email=request.email,
            questionnaire_answers=request.answers
        )
        db.add(comparison)
        db.commit()

        # Get all therapists from database
        therapists = db.query(Therapist).filter(
            Therapist.is_active == True).all()
        therapist_dicts = [
            {
                "id": t.id,
                "name": t.name,
                "professional_titles": t.professional_titles,
                "professional_id_number": t.professional_id_number,
                "specialties": t.specialties,
                "therapeutic_approaches": t.therapeutic_approaches,
                "session_price": t.session_price,
                "country": t.country,
                "city": t.city,
                "remote": t.remote,
                "on_site": t.on_site,
                "hybrid": getattr(t, 'hybrid', False),
                "bio": t.bio,
                "years_experience": t.years_experience,
                "languages": t.languages,
                "therapeutic_style": getattr(t, 'therapeutic_style', []),
                "age_groups": getattr(t, 'age_groups', []),
                "weekly_availability": getattr(t, 'weekly_availability', None),
                "commitment_level": getattr(t, 'commitment_level', None),
                "additional_info": getattr(t, 'additional_info', None)
            }
            for t in therapists
        ]

        # Convert answers to user_answers format for Gemini service
        user_answers = [
            {"question": k, "answer": v}
            for k, v in request.answers.items()
        ]

        # Test with 3 models as requested
        models = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "random"]

        for model in models:
            try:
                logger.info(f"Getting matches for model: {model}")
                matches, processing_time = gemini_service.get_matches(
                    therapist_dicts, user_answers, model)

                # Convert matches to dict format for JSON storage
                matches_dict = [
                    {
                        "id": match.id,
                        "name": match.name,
                        "specialties": match.specialties,
                        "therapeutic_approaches": match.therapeutic_approaches,
                        "session_price": match.session_price,
                        "country": match.country,
                        "city": match.city,
                        "remote": match.remote,
                        "on_site": match.on_site,
                        "bio": match.bio,
                        "match_score": match.match_score,
                        "match_reason": match.match_reason,
                        "confidence_score": match.confidence_score
                    }
                    for match in matches
                ]

                # Sort matches by confidence_score (highest first), then by match_score
                matches_dict.sort(key=lambda x: (
                    -(x.get('confidence_score') or x.get('match_score') or 0)
                ))

                # Store in database
                result = ModelResult(
                    comparison_id=comparison_id,
                    model_name=model,
                    matches=matches_dict,
                    processing_time_ms=processing_time
                )
                db.add(result)

            except Exception as e:
                logger.error(f"Error with model {model}: {str(e)}")
                # Add empty result for failed models
                result = ModelResult(
                    comparison_id=comparison_id,
                    model_name=model,
                    matches=[],
                    processing_time_ms=0.0
                )
                db.add(result)

        db.commit()
        return SubmitQuestionnaireResponse(session_id=comparison_id)

    except Exception as e:
        logger.error(f"Error submitting questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to process questionnaire")


@app.get("/api/results/{session_id}", response_model=ComparisonResponse)
async def get_results(session_id: str, db: Session = Depends(get_db)):
    """Get results for a session"""
    # Check if comparison exists
    comparison = db.query(ModelComparison).filter(
        ModelComparison.id == session_id).first()
    if not comparison:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get all results for this comparison
    results = db.query(ModelResult).filter(
        ModelResult.comparison_id == session_id).all()

    if not results:
        raise HTTPException(
            status_code=404, detail="No results found for this session")

    # Format results for frontend
    model_results = []
    display_names = {"gemini-2.5-flash-lite": "Model A",
                     "gemini-2.5-flash": "Model B", "random": "Model C"}

    for result in results:
        model_results.append(
            ModelResultResponse(
                model_name=result.model_name,
                display_name=display_names.get(
                    result.model_name, result.model_name),
                matches=result.matches,
                processing_time_ms=result.processing_time_ms
            )
        )

    return ComparisonResponse(
        comparison_id=session_id,
        results=model_results
    )


@app.post("/api/select-therapist")
async def select_therapist(
    request: UserSelectionRequest,
    db: Session = Depends(get_db)
):
    """Record user's therapist selection"""
    try:
        # Check if comparison exists
        comparison = db.query(ModelComparison).filter(
            ModelComparison.id == request.session_id).first()
        if not comparison:
            raise HTTPException(status_code=404, detail="Session not found")

        # Extract model name from feedback or default to "unknown"
        selected_model = "unknown"
        if request.feedback and "Selected from" in request.feedback:
            selected_model = request.feedback.replace("Selected from ", "")

        # Record selection
        selection = UserSelection(
            comparison_id=request.session_id,
            selected_model=selected_model,
            selected_therapist_id=request.selected_therapist_id,
            feedback=request.feedback
        )
        db.add(selection)
        db.commit()

        return {"success": True, "message": "Selection recorded successfully"}

    except Exception as e:
        logger.error(f"Error recording selection: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to record selection")


@app.post("/api/register-therapist")
async def register_therapist(request: TherapistRegistrationRequest, db: Session = Depends(get_db)):
    """Register a new therapist"""
    try:
        # Check if email already exists
        existing_therapist = db.query(Therapist).filter(
            Therapist.email == request.email).first()
        if existing_therapist:
            raise HTTPException(
                status_code=400, detail="Email already registered")

        # Create new therapist
        new_therapist = Therapist(
            name=request.name,
            professional_titles=request.professional_titles,
            professional_id_number=request.professional_id_number,
            email=request.email,
            specialties=request.specialties,
            therapeutic_approaches=request.therapeutic_approaches,
            session_price=request.session_price,
            country=request.country,
            city=request.city,
            remote=request.remote,
            on_site=request.on_site,
            hybrid=request.hybrid,
            bio=request.bio,
            years_experience=request.years_experience,
            languages=request.languages,
            therapeutic_style=request.therapeutic_style,
            age_groups=request.age_groups,
            weekly_availability=request.weekly_availability,
            commitment_level=request.commitment_level,
            additional_info=request.additional_info,
            is_active=True  # New therapists are active by default
        )

        db.add(new_therapist)
        db.commit()
        db.refresh(new_therapist)

        logger.info(
            f"New therapist registered: {new_therapist.name} ({new_therapist.email})")

        return {"success": True, "id": new_therapist.id, "message": "Therapist registered successfully"}

    except Exception as e:
        logger.error(f"Error registering therapist: {str(e)}")
        if "Email already registered" in str(e):
            raise e
        raise HTTPException(
            status_code=500, detail="Failed to register therapist")


# Protected admin endpoints (require authentication)
@app.get("/api/admin/therapists")
async def get_all_therapists_admin(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all therapists (admin only)"""
    try:
        therapists = db.query(Therapist).all()
        return [
            {
                "id": t.id,
                "name": t.name,
                "email": t.email,
                "specialties": t.specialties,
                "therapeutic_approaches": t.therapeutic_approaches,
                "session_price": t.session_price,
                "country": t.country,
                "city": t.city,
                "remote": t.remote,
                "on_site": t.on_site,
                "bio": t.bio,
                "years_experience": t.years_experience,
                "languages": t.languages,
                "is_active": t.is_active,
                "created_at": t.created_at
            }
            for t in therapists
        ]
    except Exception as e:
        logger.error(f"Error fetching therapists: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to fetch therapists")


@app.delete("/api/admin/therapists/{therapist_id}")
async def delete_therapist_admin(
    therapist_id: str,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a therapist (admin only)"""
    try:
        therapist = db.query(Therapist).filter(
            Therapist.id == therapist_id).first()
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        db.delete(therapist)
        db.commit()

        logger.info(
            f"Therapist deleted by admin: {therapist.name} ({therapist.email})")
        return {"success": True, "message": "Therapist deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting therapist: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to delete therapist")


@app.get("/api/admin/sessions")
async def get_all_sessions_admin(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all user sessions (admin only)"""
    try:
        sessions = db.query(ModelComparison).all()
        return [
            {
                "id": s.id,
                "email": s.email,
                "created_at": s.created_at,
                "questionnaire_answers": s.questionnaire_answers,
                "model_results_count": len(s.model_results),
                "user_selections_count": len(s.user_selections)
            }
            for s in sessions
        ]
    except Exception as e:
        logger.error(f"Error fetching sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch sessions")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
