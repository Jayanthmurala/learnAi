import requests
import io
import os

BASE_URL = "http://localhost:3000"
UPLOAD_ENDPOINT = "/api/upload/document"
AUTH_ENDPOINT = "/api/auth/callback/credentials"
CSRF_ENDPOINT = "/api/auth/csrf"
TIMEOUT = 30

# Test user credentials.
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "password123"


def authenticate():
    """
    Authenticate with NextAuth CredentialsProvider and return a session.
    """
    session = requests.Session()
    
    # 1. Get CSRF Token
    try:
        csrf_resp = session.get(f"{BASE_URL}{CSRF_ENDPOINT}", timeout=TIMEOUT)
        csrf_resp.raise_for_status()
        csrf_token = csrf_resp.json().get("csrfToken")
        
        # 2. Login
        data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "csrfToken": csrf_token,
            "json": "true"
        }
        
        resp = session.post(f"{BASE_URL}{AUTH_ENDPOINT}", data=data, timeout=TIMEOUT)
        # NextAuth returns 200 even if wrong creds in some cases, 
        # but the session cookie will only be set if successful.
        return session
    except Exception as e:
        print(f"Auth failed: {e}")
        return session


def test_post_api_upload_pdf_document_processing():
    session = authenticate()

    def post_file(file_bytes, filename, title="Test Document", level="intermediate"):
        files = {
            "file": (filename, file_bytes, "application/pdf"),
        }
        data = {
            "title": title,
            "learning_level": level,
        }
        try:
            resp = session.post(
                f"{BASE_URL}{UPLOAD_ENDPOINT}",
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
    
    print("Testing valid PDF upload...")
    resp_valid = post_file(valid_pdf_content, "valid_test.pdf")
    assert resp_valid.status_code == 200, f"Expected 200 OK, got {resp_valid.status_code}: {resp_valid.text}"
    
    json_valid = resp_valid.json()
    assert json_valid.get("success") is True, f"Upload failed: {json_valid}"
    
    # Validate structure
    doc_data = json_valid.get("data", {})
    assert "topics" in doc_data, "Response missing 'topics'"
    assert "lessons" in doc_data, "Response missing 'lessons'"
    assert len(doc_data["topics"]) > 0, "No topics extracted"
    assert len(doc_data["lessons"]) > 0, "No lessons/scripts generated"
    
    print("✓ Valid PDF Test Passed")

    # 2. Corrupted PDF test
    print("Testing corrupted PDF...")
    corrupted_content = b"Not a PDF"
    resp_corrupt = post_file(corrupted_content, "broken.pdf")
    # Our backend might still try to read it or return 400
    assert resp_corrupt.status_code in (400, 500), f"Expected client/server error, got {resp_corrupt.status_code}"
    print("✓ Corrupted PDF Test Passed")

if __name__ == "__main__":
    test_post_api_upload_pdf_document_processing()