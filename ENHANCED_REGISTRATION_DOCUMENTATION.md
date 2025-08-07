# Kuna Therapist Matching System - Enhanced Registration

## Changes Implemented

This document outlines the changes made to enhance the Kuna therapist matching system based on the user's requirements.

### 1. GeminiMatchingService - Single Therapist Per Model

**Changes Made:**

- Modified `get_matches()` method to always return exactly 1 therapist per model
- Updated `_get_random_matches()` to select only 1 therapist for consistency
- Updated `_get_gemini_matches()` to select only 1 therapist for all AI models
- Both lite and flash models now return exactly 1 therapist each

**Files Modified:**

- `gemini_service.py`

### 2. Enhanced Therapist Registration Form

**New Fields Added:**
Based on the provided questionnaire, the following fields were added to the therapist registration:

1. **Nombre completo y títulos profesionales** - `professional_titles`
2. **Número de cédula profesional / registro local** - `professional_id_number`
3. **Modalidades de atención** - Enhanced with `hybrid` option
4. **Ubicación** - Existing `country` and `city` fields
5. **Idiomas** - Enhanced `languages` with custom input option
6. **Especialidades clínicas** - Enhanced `specialties` with custom input option
7. **Enfoques terapéuticos** - Enhanced `therapeutic_approaches` with custom input option
8. **Estilo terapéutico** - New `therapeutic_style` field (max 2 selections)
9. **Rangos de edad** - New `age_groups` field
10. **Disponibilidad semanal** - New `weekly_availability` field
11. **Nivel de compromiso** - New `commitment_level` field
12. **Campo libre opcional** - New `additional_info` field

**Files Modified:**

- `frontend/src/pages/TherapistRegistrationPage.tsx` - Complete redesign with all new fields
- `schemas.py` - Updated models to include new fields
- `database.py` - Updated Therapist model with new columns
- `main.py` - Updated API endpoint to handle new fields

### 3. Database Migration

**Migration Script:**

- Created `migrate_therapist_table.py` to safely add new columns to existing database
- Script checks for existing columns before adding new ones
- Provides backup and rollback functionality

**New Database Columns:**

```sql
ALTER TABLE therapists ADD COLUMN professional_titles TEXT;
ALTER TABLE therapists ADD COLUMN professional_id_number TEXT;
ALTER TABLE therapists ADD COLUMN hybrid BOOLEAN DEFAULT FALSE;
ALTER TABLE therapists ADD COLUMN therapeutic_style TEXT;  -- JSON array
ALTER TABLE therapists ADD COLUMN age_groups TEXT;  -- JSON array
ALTER TABLE therapists ADD COLUMN weekly_availability TEXT;
ALTER TABLE therapists ADD COLUMN commitment_level TEXT;
ALTER TABLE therapists ADD COLUMN additional_info TEXT;
```

### 4. Frontend Enhancements

**New Features:**

- Organized form into numbered sections matching the original questionnaire
- Added custom input fields for specialties, approaches, languages, and styles
- Implemented maximum 2 selections for therapeutic style
- Added radio buttons for commitment level
- Enhanced validation and user experience
- Maintained Spanish language throughout (for Latin America market)

**Validation Rules:**

- Name and email remain required
- At least one specialty must be selected
- Maximum 2 therapeutic styles can be selected
- All other fields are optional but encouraged

### 5. API Compatibility

**Backward Compatibility:**

- Existing therapist records continue to work
- New fields are optional and default to appropriate values
- API uses `getattr()` with defaults for missing fields

**Enhanced API Response:**

- All new fields are now included in therapist data
- Matching service receives full therapist profiles
- Frontend receives complete therapist information

## Testing

**Integration Test:**

- Created `test_enhanced_registration.py` to verify functionality
- Tests both enhanced registration and single-therapist matching
- Confirms all new fields are properly saved and retrieved

**Test Results:**

- ✅ Enhanced Registration: All new fields properly saved to database
- ✅ Single Therapist Matching: Each model returns exactly 1 therapist
- ✅ Backward Compatibility: Existing data continues to work

## Usage

### Running the System

1. **Backend:**

   ```bash
   cd /Users/feliperobalino/projects/kuna/model_test
   python main.py
   ```

   Server runs on: http://localhost:8002

2. **Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend runs on: http://localhost:3001

3. **Database Migration (if needed):**
   ```bash
   python migrate_therapist_table.py
   ```

### Accessing the Enhanced Registration

1. Navigate to http://localhost:3001
2. Click on therapist registration link
3. Fill out the comprehensive 12-section form
4. Submit to save all new information to the database

## Technical Notes

- All new fields are stored as appropriate data types (TEXT, JSON arrays, etc.)
- The system maintains compatibility with existing Latin America focus
- Currency changed from EUR (€) to USD ($) to better serve Latin American market
- All user-facing text remains in Spanish
- Form includes validation and user guidance throughout

## Future Enhancements

Potential improvements for future versions:

- Add professional verification workflow
- Implement therapist profile photos
- Add availability calendar integration
- Create therapist dashboard for profile management
- Add multilingual support for other Latin American countries
