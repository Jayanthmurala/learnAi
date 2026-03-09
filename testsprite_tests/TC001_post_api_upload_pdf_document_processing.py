import requests
import io
import os

BASE_URL = "http://localhost:3000"
UPLOAD_ENDPOINT = "/api/upload"
AUTH_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

# Test user credentials. Adjust if needed.
TEST_USER_EMAIL = "testuser@example.com"
TEST_USER_PASSWORD = "TestPassword123!"


def authenticate():
    url = f"{BASE_URL}{AUTH_ENDPOINT}"
    data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    }
    try:
        resp = requests.post(url, json=data, timeout=TIMEOUT)
        resp.raise_for_status()
        # Assuming authentication returns a JWT token in JSON { token: "..." }
        token = resp.json().get("token")
        if not token:
            raise ValueError("Authentication token missing in response")
        return token
    except (requests.RequestException, ValueError) as e:
        raise RuntimeError(f"Authentication failed: {e}")


def test_post_api_upload_pdf_document_processing():
    token = authenticate()
    headers = {
        "Authorization": f"Bearer {token}"
    }

    def post_file(file_bytes, filename, course_title="Test Course", learning_level="Beginner"):
        files = {
            "file": (filename, file_bytes, "application/pdf"),
        }
        data = {
            "courseTitle": course_title,
            "learningLevel": learning_level,
        }
        try:
            resp = requests.post(
                f"{BASE_URL}{UPLOAD_ENDPOINT}",
                headers=headers,
                files=files,
                data=data,
                timeout=TIMEOUT
            )
            return resp
        except requests.RequestException as e:
            raise RuntimeError(f"Request to {UPLOAD_ENDPOINT} failed: {e}")

    # 1. Valid PDF file upload test
    valid_pdf_content = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n"
        b"4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello PDF) Tj\nET\nendstream\nendobj\n"
        b"xref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000067 00000 n \n0000000120 00000 n \n0000000200 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n265\n%%EOF"
    )
    resp_valid = post_file(valid_pdf_content, "valid_test.pdf")
    assert resp_valid.status_code == 200, f"Expected 200 OK for valid PDF, got {resp_valid.status_code}"
    json_valid = resp_valid.json()
    # Validate AI analysis response structure: it should contain extracted topics and scripts
    assert "topics" in json_valid, "Response missing 'topics'"
    assert isinstance(json_valid["topics"], list), "'topics' should be a list"
    for topic in json_valid["topics"]:
        assert "title" in topic, "Each topic must contain 'title'"
        assert "script" in topic, "Each topic must contain 'script'"

    # 2. Large PDF file test (simulate large file by repeating valid content to exceed typical limits)
    large_pdf_content = valid_pdf_content * 1024 * 50  # ~2.2MB approximately, adjust if needed
    try:
        resp_large = post_file(large_pdf_content, "large_test.pdf")
        # Expecting rejection with error message or 413 Payload Too Large
        assert resp_large.status_code in (400, 413), f"Expected 400 Bad Request or 413 Payload Too Large for large file, got {resp_large.status_code}"
        json_large = resp_large.json()
        # Check error message includes size or processing failure hint
        assert "error" in json_large or "message" in json_large, "Large file response should contain 'error' or 'message'"
    except RuntimeError as e:
        # If server closes connection or errors out, treat as acceptable failure for large file
        pass

    # 3. Corrupted PDF file upload test (partial or corrupted PDF content)
    corrupted_pdf_content = b"%PDF-1.4 corrupted content that does not conform to PDF format"
    resp_corrupt = post_file(corrupted_pdf_content, "corrupted_test.pdf")
    assert resp_corrupt.status_code in (400, 422), f"Expected client error status for corrupted PDF, got {resp_corrupt.status_code}"
    json_corrupt = resp_corrupt.json()
    assert "error" in json_corrupt or "message" in json_corrupt, "Corrupted file response should have 'error' or 'message'"

    # 4. Missing course title or learning level fields validation (should fail)
    files = {
        "file": ("valid_test.pdf", io.BytesIO(valid_pdf_content), "application/pdf"),
    }
    # Missing courseTitle
    resp_missing_field = requests.post(
        f"{BASE_URL}{UPLOAD_ENDPOINT}",
        headers=headers,
        files=files,
        data={"learningLevel": "Intermediate"},
        timeout=TIMEOUT
    )
    assert resp_missing_field.status_code == 400, f"Expected 400 Bad Request for missing courseTitle, got {resp_missing_field.status_code}"
    json_missing = resp_missing_field.json()
    assert "error" in json_missing or "message" in json_missing, "Missing field response should contain error message"

    # Missing learningLevel
    resp_missing_field2 = requests.post(
        f"{BASE_URL}{UPLOAD_ENDPOINT}",
        headers=headers,
        files=files,
        data={"courseTitle": "Test Course without learning level"},
        timeout=TIMEOUT
    )
    assert resp_missing_field2.status_code == 400, f"Expected 400 Bad Request for missing learningLevel, got {resp_missing_field2.status_code}"
    json_missing2 = resp_missing_field2.json()
    assert "error" in json_missing2 or "message" in json_missing2, "Missing field response should contain error message"


test_post_api_upload_pdf_document_processing()