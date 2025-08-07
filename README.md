# Gemini Model Comparison for Therapist Matching

This web application allows you to compare different Google Gemini models for matching patients with therapists. It's designed to help improve AI-powered recommendation systems for mental health services.

## Features

- **Model Comparison**: Compare multiple Gemini models (plus a random control) for therapist matching
- **User Interface**: Clean web interface for questionnaires and results comparison
- **Admin Panel**: Manage questions and therapist profiles
- **Data Collection**: Store user selections to analyze model performance
- **Sample Data**: Pre-populated with realistic therapist profiles and questionnaire

## Models Compared

1. **gemini-2.5-flash-lite-preview-06-17** - Your current model
2. **gemini-1.5-flash** - Faster, efficient model
3. **gemini-1.5-pro** - More powerful model
4. **Random Control** - Random matching for baseline comparison

## Setup Instructions

### 1. Install Dependencies

```bash
# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install requirements
pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file is already configured with:

- SQLite database (no PostgreSQL setup needed for testing)
- Your Gemini API key

### 3. Initialize Database and Sample Data

```bash
# Create sample questions and therapists
python create_sample_data.py
```

### 4. Run the Application

```bash
# Start the FastAPI server
python main.py
```

The application will be available at:

- **Main App**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/docs

## How to Use

### For Testing Models:

1. Go to http://localhost:8000
2. Enter your email and complete the questionnaire
3. The system will generate matches using all available models
4. Compare the results and select which model gave you the best match
5. Your feedback is stored to improve the models

### For Administration:

1. Go to http://localhost:8000/admin
2. **Questions Tab**: Add new questionnaire questions
3. **Therapists Tab**: Add new therapist profiles

## Database Schema

The application creates these tables:

- `model_comparisons` - User sessions and questionnaire responses
- `model_results` - Results from each model for comparison
- `user_selections` - User feedback on which model performed best
- `questions` - Questionnaire questions
- `therapists` - Therapist profiles

## API Endpoints

- `GET /` - Main questionnaire page
- `POST /api/compare-models` - Compare models and get matches
- `GET /comparison/{id}` - View comparison results
- `POST /api/user-selection` - Submit user's model preference
- `GET /admin` - Admin panel
- `POST /api/admin/questions` - Add questions
- `POST /api/admin/therapists` - Add therapists

## Customization

### Adding New Models

Edit `gemini_service.py` and add new model names to the `get_available_models()` method.

### Changing Question Types

Supported question types:

- `multiple_choice` - Multiple checkboxes
- `single_choice` - Radio buttons
- `scale` - 1-10 slider
- `text_input` - Text area
- `yes_no` - Yes/No radio buttons

### Database Migration

To use PostgreSQL instead of SQLite:

1. Update `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://username:password@localhost/dbname
```

2. Ensure PostgreSQL is installed and running

## Sample Data

The application includes:

- 9 sample questionnaire questions covering therapy preferences
- 12 diverse therapist profiles from different countries and specialties
- Realistic data for testing the matching algorithms

## Analytics

User selections are stored to analyze:

- Which models perform best for different user types
- Common patterns in user preferences
- Model accuracy and user satisfaction

## Troubleshooting

1. **Import Errors**: Make sure you've activated the virtual environment and installed requirements
2. **Database Errors**: Run `python create_sample_data.py` to initialize the database
3. **Gemini API Errors**: Check that your API key is correct in `.env`
4. **Port Issues**: Change the port in `main.py` if 8000 is in use

## Next Steps

1. Add more sophisticated matching algorithms
2. Implement user authentication
3. Add detailed analytics dashboard
4. Export comparison results
5. Add model performance metrics
