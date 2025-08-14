from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()


class ModelComparison(Base):
    __tablename__ = "model_comparisons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False)
    questionnaire_answers = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    model_results = relationship("ModelResult", back_populates="comparison")
    user_selections = relationship(
        "UserSelection", back_populates="comparison")


class ModelResult(Base):
    __tablename__ = "model_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    comparison_id = Column(String, ForeignKey("model_comparisons.id"))
    # e.g., "gemini-2.5-flash-lite", "random"
    model_name = Column(String, nullable=False)
    matches = Column(JSON, nullable=False)  # Array of matched therapist data
    processing_time_ms = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    comparison = relationship(
        "ModelComparison", back_populates="model_results")


class UserSelection(Base):
    __tablename__ = "user_selections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    comparison_id = Column(String, ForeignKey("model_comparisons.id"))
    # Keep for backward compatibility
    selected_model = Column(String, nullable=True)
    selected_therapist_id = Column(String, nullable=False)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    comparison = relationship(
        "ModelComparison", back_populates="user_selections")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    question_text = Column(Text, nullable=False)
    # multiple_choice, scale, text_input, yes_no
    question_type = Column(String, nullable=False)
    options = Column(JSON)  # For multiple choice questions
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)


class Therapist(Base):
    __tablename__ = "therapists"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    professional_titles = Column(String)  # Títulos profesionales
    professional_id_number = Column(String)  # Número de cédula profesional
    email = Column(String, nullable=False, unique=True)
    specialties = Column(JSON)  # Array of specialties
    therapeutic_approaches = Column(JSON)  # Array of approaches
    session_price = Column(Float)
    # Willing to negotiate price
    price_negotiable = Column(Boolean, default=False)
    country = Column(String)
    city = Column(String)
    remote = Column(Boolean, default=False)
    on_site = Column(Boolean, default=False)
    hybrid = Column(Boolean, default=False)  # Nueva modalidad híbrida
    bio = Column(Text)
    years_experience = Column(Integer)
    languages = Column(JSON)  # Array of languages
    therapeutic_style = Column(JSON)  # Array of therapeutic styles (up to 2)
    age_groups = Column(JSON)  # Array of age groups they prefer to work with
    weekly_availability = Column(Text)  # Días y horarios aproximados
    commitment_level = Column(String)  # Nivel de compromiso con Kuna
    additional_info = Column(Text)  # Campo libre opcional
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Database connection (SQLite for development, PostgreSQL for production)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./therapist_matching.db")

# Configure engine based on database type
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL)
else:
    # SQLite configuration
    engine = create_engine(DATABASE_URL, connect_args={
                           "check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables


def create_tables():
    Base.metadata.create_all(bind=engine)

# Initialize database


def init_db():
    create_tables()
