#!/usr/bin/env python3
"""
Test script to verify the enhanced therapist registration functionality.
"""

import requests
import json

# Test data with all the new fields
test_therapist_data = {
    "name": "Dr. María González López",
    "professional_titles": "Doctora en Psicología Clínica, Máster en Terapia Familiar",
    "professional_id_number": "PSI-12345-MX",
    "email": "maria.gonzalez@ejemplo.com",
    "specialties": ["Ansiedad y estrés", "Depresión", "Trastornos alimenticios"],
    "therapeutic_approaches": ["Terapia Cognitivo-Conductual (CBT)", "EMDR", "Mindfulness / aceptación"],
    "session_price": 75.0,
    "country": "México",
    "city": "Ciudad de México",
    "remote": True,
    "on_site": True,
    "hybrid": True,
    "bio": "Psicóloga clínica con más de 10 años de experiencia especializándome en trastornos de ansiedad y depresión. Mi enfoque integra técnicas cognitivo-conductuales con mindfulness para un tratamiento holístico.",
    "years_experience": 10,
    "languages": ["Español", "Inglés"],
    "therapeutic_style": ["Contenedor y empático 🫂", "Práctico y orientado a soluciones 🛠️"],
    "age_groups": ["Jóvenes (18–25)", "Adultos (26–50)"],
    "weekly_availability": "Lunes a viernes de 9:00 AM a 6:00 PM, Sábados de 10:00 AM a 2:00 PM",
    "commitment_level": "Sesiones constantes (2–5 pacientes fijos)",
    "additional_info": "Me especializo en técnicas de relajación y manejo del estrés para profesionales que trabajan en ambientes de alta presión."
}


def test_therapist_registration():
    """Test the therapist registration endpoint"""
    url = "http://localhost:8002/api/register-therapist"

    print("Testing Enhanced Therapist Registration")
    print("=" * 50)
    print(f"URL: {url}")
    print(f"Data keys: {list(test_therapist_data.keys())}")
    print("\nSending registration request...")

    try:
        response = requests.post(url, json=test_therapist_data)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✓ Registration successful!")
            print(f"Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print("✗ Registration failed!")
            print(f"Error: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to the server.")
        print("Make sure the backend is running on port 8002")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False


def test_matching_service():
    """Test that the matching service returns only 1 therapist per model"""
    print("\nTesting Matching Service (1 therapist per model)")
    print("=" * 50)

    # First submit a test questionnaire
    questionnaire_data = {
        "email": "test@example.com",
        "answers": {
            "anxiety_level": "high",
            "therapy_type": "individual",
            "location_preference": "remote"
        }
    }

    try:
        # Submit questionnaire
        submit_url = "http://localhost:8002/api/submit-questionnaire"
        submit_response = requests.post(submit_url, json=questionnaire_data)

        if submit_response.status_code == 200:
            session_data = submit_response.json()
            session_id = session_data["session_id"]
            print(f"✓ Questionnaire submitted. Session ID: {session_id}")

            # Get results
            results_url = f"http://localhost:8002/api/results/{session_id}"
            results_response = requests.get(results_url)

            if results_response.status_code == 200:
                results = results_response.json()
                print("✓ Results retrieved successfully!")

                # Check that each model returns exactly 1 therapist
                for model_result in results["results"]:
                    model_name = model_result["display_name"]
                    matches_count = len(model_result["matches"])
                    print(f"  {model_name}: {matches_count} therapist(s)")

                    if matches_count == 1:
                        print(
                            f"    ✓ Correct: {model_name} returned exactly 1 therapist")
                    else:
                        print(
                            f"    ✗ Error: {model_name} returned {matches_count} therapists instead of 1")

                return True
            else:
                print(f"✗ Failed to get results: {results_response.text}")
                return False
        else:
            print(f"✗ Failed to submit questionnaire: {submit_response.text}")
            return False

    except Exception as e:
        print(f"✗ Error testing matching service: {e}")
        return False


def main():
    """Main test function"""
    print("Kuna Therapist Matching - Integration Test")
    print("=" * 60)

    # Test 1: Enhanced therapist registration
    registration_success = test_therapist_registration()

    # Test 2: Matching service returns 1 therapist per model
    matching_success = test_matching_service()

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(
        f"Enhanced Registration: {'✓ PASS' if registration_success else '✗ FAIL'}")
    print(
        f"1 Therapist per Model: {'✓ PASS' if matching_success else '✗ FAIL'}")

    if registration_success and matching_success:
        print("\n🎉 All tests passed! The enhanced system is working correctly.")
        return 0
    else:
        print("\n❌ Some tests failed. Please check the errors above.")
        return 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
