# Therapist Matching Model Comparison - Updated Architecture

This project has been updated with a modern React SPA frontend and a JSON API backend to replace the previous Jinja2 template-based interface.

## Project Structure

```
model_test/
├── backend/               # FastAPI backend (existing files)
│   ├── main.py           # Updated JSON API endpoints
│   ├── schemas.py        # Updated Pydantic models
│   ├── database.py       # Database models (slightly updated)
│   ├── gemini_service.py # Updated with confidence scores
│   ├── requirements.txt  # Python dependencies
│   └── ...
├── frontend/             # NEW: React SPA
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Main pages
│   │   ├── store/        # Zustand state management
│   │   ├── lib/          # API client and utilities
│   │   └── App.tsx       # Main app component
│   ├── package.json      # Node.js dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── ...
└── start-frontend.sh     # Frontend startup script
```

## Updated User Flow

1. **Welcome Screen** (/) - User enters email
2. **Questionnaire** (/questionnaire) - One question at a time with progress
3. **Results** (/results/:sessionId) - Side-by-side model comparison
4. **Selection** - User selects best therapist match
5. **Thank You** (/thank-you) - Completion confirmation

## New Features

### Backend Changes (main.py)

- **CORS support** for React development server
- **JSON-first API** with proper error handling
- **Email-based session management**
- **Confidence scores** from LLM models
- **Updated endpoints**:
  - `GET /api/questions` - Get questionnaire questions
  - `POST /api/submit-questionnaire` - Submit answers, get session ID
  - `GET /api/results/{session_id}` - Get model comparison results
  - `POST /api/select-therapist` - Record user's final selection

### Frontend Features

- **Modern React SPA** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS + shadcn/ui** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Progressive questionnaire** with one question per screen
- **Real-time progress tracking**
- **Side-by-side model comparison**
- **Responsive design**

### Enhanced LLM Integration

- **Confidence scores** (1-100) for each therapist match
- **Updated prompts** to request confidence levels
- **Better error handling** for model failures
- **Control group** comparison (random matches)

## Setup Instructions

### Backend Setup

1. Make sure you have your existing Python environment activated
2. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```
3. Set your `GEMINI_API_KEY` in a `.env` file
4. Start the backend:
   ```bash
   python main.py
   ```
   The API will be available at http://localhost:8002

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

### Running Locally with Docker

1. Ensure Docker and Docker Compose are installed on your machine.
2. Create a `.env` file at the project root containing:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. From the repository root, run:
   ```bash
   docker-compose up --build
   ```
4. Access the running services in your browser:
   - Backend: http://localhost:8002
   - Frontend: http://localhost:3000

### Quick Start

You can also use the provided script:

```bash
./start-frontend.sh
```

## API Endpoints

### GET /api/questions

Returns all active questionnaire questions.

**Response:**

```json
[
  {
    "id": "uuid",
    "question_text": "What is your preferred therapy format?",
    "question_type": "single_choice",
    "options": ["In-person", "Online", "Both"],
    "display_order": 1,
    "is_active": true
  }
]
```

### POST /api/submit-questionnaire

Submit questionnaire answers and get session ID.

**Request:**

```json
{
  "email": "user@example.com",
  "answers": {
    "question_id_1": "answer_value_1",
    "question_id_2": "answer_value_2"
  }
}
```

**Response:**

```json
{
  "session_id": "uuid"
}
```

### GET /api/results/{session_id}

Get model comparison results for a session.

**Response:**

```json
{
  "comparison_id": "uuid",
  "results": [
    {
      "model_name": "gemini-2.5-flash-lite",
      "display_name": "Model A",
      "matches": [
        {
          "id": "therapist_id",
          "name": "Dr. Smith",
          "specialties": ["Anxiety", "Depression"],
          "confidence_score": 85,
          "match_score": 92,
          "match_reason": "Strong match based on specialties"
        }
      ],
      "processing_time_ms": 1250.5
    }
  ]
}
```

### POST /api/select-therapist

Record user's final therapist selection.

**Request:**

```json
{
  "session_id": "uuid",
  "selected_therapist_id": "therapist_id",
  "feedback": "This seemed like the best match"
}
```

## Database Changes

### Updated Fields

- **ModelResult.matches** now includes `confidence_score` field
- **UserSelection** removed `selected_model` field (not needed with new flow)

### New Session Flow

- Sessions are identified by `comparison_id` (now called `session_id` in API)
- Email addresses are used to identify users within sessions
- Results are accessed via session ID in the URL

## Technologies Used

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **Google Generative AI** - LLM integration

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Zustand** - State management
- **React Router** - Client-side routing

## Development Notes

### State Management

The React app uses Zustand for global state management, storing:

- User email and session data
- Questionnaire questions and answers
- Current question index and progress
- API results and loading states

### API Integration

The frontend includes a comprehensive API client (`src/lib/api.ts`) that handles:

- Automatic error handling
- Type-safe requests and responses
- Base URL configuration for development

### Styling

The app uses Tailwind CSS with a custom design system based on shadcn/ui components, providing:

- Consistent spacing and typography
- Responsive design patterns
- Accessible component variants
- Dark mode support (ready to enable)

This updated architecture provides a much better user experience while maintaining the core research functionality of comparing different LLM models for therapist matching.
