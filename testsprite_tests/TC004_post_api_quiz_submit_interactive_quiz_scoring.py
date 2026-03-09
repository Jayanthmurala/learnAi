import requests

BASE_URL = "http://localhost:3000"
QUIZ_SUBMIT_ENDPOINT = "/api/quiz/submit"
TIMEOUT = 30

# Assume authentication is required - implement auth and get token or session cookies as needed.
# For this example, let's assume using a predefined auth token.
AUTH_TOKEN = "Bearer your_valid_jwt_token_here"
HEADERS = {
    "Authorization": AUTH_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}

def test_post_api_quiz_submit_interactive_quiz_scoring():
    """
    Test the /api/quiz/submit endpoint for submitting quiz answers,
    validating required questions completion, scoring accuracy,
    feedback correctness, and handling incomplete submissions.
    """
    # Sample quiz submission payload with all required questions answered
    complete_quiz_payload = {
        "quizId": "quiz123",
        "userId": "user456",
        "answers": [
            {"questionId": "q1", "answer": "A"},
            {"questionId": "q2", "answer": "C"},
            {"questionId": "q3", "answer": "B"}
        ]
    }

    # Partial/incomplete quiz submission payload (missing answer for question 2)
    incomplete_quiz_payload = {
        "quizId": "quiz123",
        "userId": "user456",
        "answers": [
            {"questionId": "q1", "answer": "A"},
            # Missing question 2 answer
            {"questionId": "q3", "answer": "B"}
        ]
    }

    # 1. Test successful submission with all required questions answered
    try:
        resp = requests.post(
            BASE_URL + QUIZ_SUBMIT_ENDPOINT,
            headers=HEADERS,
            json=complete_quiz_payload,
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        data = resp.json()
        # Validate response structure
        assert "score" in data, "Response missing 'score'"
        assert "feedback" in data, "Response missing 'feedback'"
        assert isinstance(data["score"], (int, float)), "'score' must be a number"
        assert isinstance(data["feedback"], list), "'feedback' must be a list"
        # Each feedback item should have questionId and correctness information
        for fb in data["feedback"]:
            assert "questionId" in fb, "Feedback item missing 'questionId'"
            assert "correct" in fb, "Feedback item missing 'correct'"
            assert isinstance(fb["correct"], bool), "'correct' must be boolean"
    except requests.RequestException as e:
        assert False, f"RequestException during complete quiz submit: {e}"

    # 2. Test submission with incomplete answers (missing required questions)
    try:
        resp = requests.post(
            BASE_URL + QUIZ_SUBMIT_ENDPOINT,
            headers=HEADERS,
            json=incomplete_quiz_payload,
            timeout=TIMEOUT,
        )
        # Expecting 400 Bad Request or validation error due to incomplete answers
        assert resp.status_code in (400, 422), f"Expected 400 or 422 for incomplete submission, got {resp.status_code}"
        data = resp.json()
        # Validate error message presence
        assert "error" in data or "message" in data, "Expected error or message in response for incomplete submission"
    except requests.RequestException as e:
        assert False, f"RequestException during incomplete quiz submit: {e}"

    # 3. Test scoring accuracy with known correct/incorrect answers
    # Let's submit answers known to be all correct or all incorrect for scoring test
    known_answers_payload = {
        "quizId": "quiz123",
        "userId": "user456",
        "answers": [
            {"questionId": "q1", "answer": "A"},  # Assume correct
            {"questionId": "q2", "answer": "C"},  # Assume correct
            {"questionId": "q3", "answer": "B"}   # Assume incorrect
        ]
    }
    try:
        resp = requests.post(
            BASE_URL + QUIZ_SUBMIT_ENDPOINT,
            headers=HEADERS,
            json=known_answers_payload,
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        data = resp.json()
        assert "score" in data and "feedback" in data, "Missing score or feedback in response"
        # Score should be properly computed between 0 and total number of questions
        total_questions = 3
        assert 0 <= data["score"] <= total_questions, f"Score {data['score']} out of bounds"
        # Feedback correctness corresponds to answers:
        feedbacks = {fb["questionId"]: fb for fb in data["feedback"]}
        assert feedbacks["q1"]["correct"] is True, "q1 should be correct"
        assert feedbacks["q2"]["correct"] is True, "q2 should be correct"
        assert feedbacks["q3"]["correct"] is False, "q3 should be incorrect"
    except requests.RequestException as e:
        assert False, f"RequestException during known answers quiz submit: {e}"

    # 4. Test feedback correctness detail - feedbacks include hints or explanations if present
    detailed_feedback_payload = {
        "quizId": "quiz123",
        "userId": "user456",
        "answers": [
            {"questionId": "q1", "answer": "B"},
            {"questionId": "q2", "answer": "D"},
            {"questionId": "q3", "answer": "C"}
        ]
    }
    try:
        resp = requests.post(
            BASE_URL + QUIZ_SUBMIT_ENDPOINT,
            headers=HEADERS,
            json=detailed_feedback_payload,
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        data = resp.json()
        feedback = data.get("feedback", [])
        for fb in feedback:
            # Optional feedback content: hint or explanation about the answer
            assert "questionId" in fb, "Feedback missing questionId"
            assert "correct" in fb, "Feedback missing correctness"
            # If explanations are provided, they should be strings if present
            if "explanation" in fb:
                assert isinstance(fb["explanation"], str), "Explanation must be a string"
    except requests.RequestException as e:
        assert False, f"RequestException during detailed feedback quiz submit: {e}"


test_post_api_quiz_submit_interactive_quiz_scoring()