import requests
import time

BASE_URL = "http://localhost:3000"
UPDATE_ENDPOINT = "/api/lesson/update"
CREATE_ENDPOINT = "/api/lesson/create"
DELETE_ENDPOINT = "/api/lesson/delete"
AUTH_ENDPOINT = "/api/auth/session"
TIMEOUT = 30


def authenticate():
    """
    Authenticate with backend to get auth cookies or headers.
    Assuming next-auth session cookie retrieval.
    """
    session = requests.Session()
    # Replace these credentials with valid test user credentials
    login_url = f"{BASE_URL}/api/auth/callback/credentials"
    # Not enough info in PRD to perform credential login exact flow,
    # so here we assume session established externally or skip auth.
    # If auth is a must, this function can be enhanced.
    return session


def create_lesson(session):
    """
    Create a lesson to obtain valid lesson ID for update tests.
    We mock this with a minimal payload since schema not provided.
    """
    url = f"{BASE_URL}{CREATE_ENDPOINT}"
    payload = {
        "title": "Test Lesson for Script Editing",
        "script": "Initial script content"
    }
    headers = {"Content-Type": "application/json"}
    resp = session.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    lesson_id = data.get("id") or data.get("_id")
    assert lesson_id, "Lesson ID not returned on create"
    return lesson_id


def delete_lesson(session, lesson_id):
    url = f"{BASE_URL}{DELETE_ENDPOINT}"
    headers = {"Content-Type": "application/json"}
    resp = session.delete(url, json={"id": lesson_id}, headers=headers, timeout=TIMEOUT)
    # Not strictly necessary to assert success on cleanup, but we do log
    if resp.status_code not in (200, 204):
        print(f"Warning: Failed to delete lesson {lesson_id}, status: {resp.status_code}")


def test_post_api_lesson_update_script_editing():
    session = authenticate()

    # Create lesson resource to update
    lesson_id = None
    try:
        lesson_id = create_lesson(session)

        url = f"{BASE_URL}{UPDATE_ENDPOINT}"
        headers = {"Content-Type": "application/json"}

        # 1. Test successful save of edited lesson script
        valid_payload = {
            "id": lesson_id,
            "script": "This is the edited lesson script content with some updates."
        }
        resp = session.post(url, json=valid_payload, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        resp_json = resp.json()
        assert resp_json.get("success") is True or resp_json.get("message") == "Saved successfully", f"Unexpected success response: {resp_json}"

        # 2. Test validation error: empty script
        invalid_payload_empty_script = {
            "id": lesson_id,
            "script": ""
        }
        resp = session.post(url, json=invalid_payload_empty_script, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400 or resp.status_code == 422, f"Expected 400 or 422 for validation error, got {resp.status_code}"
        resp_json = resp.json()
        validation_msg = resp_json.get("error") or resp_json.get("message") or ""
        assert "validation" in validation_msg.lower() or "script" in validation_msg.lower() or "empty" in validation_msg.lower(), f"Unexpected validation error message: {validation_msg}"

        # 3. Test validation error: missing lesson id
        invalid_payload_no_id = {
            "script": "Trying to save without id"
        }
        resp = session.post(url, json=invalid_payload_no_id, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400 or resp.status_code == 422, f"Expected 400 or 422 for missing id error, got {resp.status_code}"
        resp_json = resp.json()
        missing_id_msg = resp_json.get("error") or resp_json.get("message") or ""
        assert "id" in missing_id_msg.lower(), f"Expected error mentioning missing id, got: {missing_id_msg}"

        # 4. Test error handling with retry option simulation
        # Simulate server error by sending invalid data type for script to trigger 500 or 4xx error
        error_payload = {
            "id": lesson_id,
            "script": {"invalid": "object instead of string"}
        }
        resp = session.post(url, json=error_payload, headers=headers, timeout=TIMEOUT)
        assert resp.status_code >= 400, f"Expected error status code, got {resp.status_code}"
        resp_json = resp.json()
        error_msg = resp_json.get("error") or resp_json.get("message") or ""
        # Retry logic: We retry once more with valid data after error to verify recovery
        retry_payload = {
            "id": lesson_id,
            "script": "Retry save after error with valid script content."
        }
        time.sleep(1)  # Pause briefly before retry
        retry_resp = session.post(url, json=retry_payload, headers=headers, timeout=TIMEOUT)
        assert retry_resp.status_code == 200, f"Retry save failed with status {retry_resp.status_code}"
        retry_json = retry_resp.json()
        assert retry_json.get("success") is True or retry_json.get("message") == "Saved successfully"

    finally:
        if lesson_id:
            delete_lesson(session, lesson_id)


test_post_api_lesson_update_script_editing()