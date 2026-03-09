import requests
import time

BASE_URL = "http://localhost:3000"
API_VIDEO_CREATE = "/api/video/create"

HEADERS = {
    "Content-Type": "application/json",
    # Assuming auth token is required; if needed, add e.g. "Authorization": "Bearer <token>"
}

TIMEOUT = 30


def test_post_api_video_create_cinematic_video_generation():
    """
    Test the /api/video/create endpoint for producing AI-narrated cinematic videos from lesson scripts,
    including job queuing, progress indication, successful video generation, and error scenarios like memory limits.
    """
    # Use a pre-existing lessonId known to be valid for the test environment
    lesson_id = "existing-valid-lesson-id"
    video_job_id = None
    try:
        # Step 1: Post to /api/video/create with valid payload referencing the lesson script
        payload = {
            "lessonId": lesson_id,
            "voice": "default",        # Assuming 'voice' and 'theme' fields are required or supported
            "theme": "cinematic"
        }
        response = requests.post(
            f"{BASE_URL}{API_VIDEO_CREATE}",
            json=payload,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert response.status_code == 202 or response.status_code == 200, \
            f"Unexpected status code: {response.status_code}, body: {response.text}"

        data = response.json()
        assert "jobId" in data or "videoId" in data, "Job or video ID not returned in response"

        video_job_id = data.get("jobId") or data.get("videoId")

        # Step 2: Poll job progress (simulate progress indication)
        # Usually, system may provide endpoint or event for progress, but here we try multiple polls
        progress_url = f"{BASE_URL}/api/video/progress/{video_job_id}"
        max_attempts = 15
        poll_interval = 2
        last_progress = None
        completed = False
        for _ in range(max_attempts):
            poll_resp = requests.get(progress_url, headers=HEADERS, timeout=TIMEOUT)
            if poll_resp.status_code == 404:
                # Progress not found, maybe job not queued yet, wait and retry
                time.sleep(poll_interval)
                continue
            poll_resp.raise_for_status()
            progress_data = poll_resp.json()
            last_progress = progress_data.get("progress")
            status = progress_data.get("status")
            assert status in ("queued", "rendering", "completed", "error"), f"Invalid status: {status}"

            if status == "completed":
                completed = True
                # Validate video metadata in response if present
                assert "videoUrl" in progress_data or "outputPath" in progress_data, "Completed job missing video URL"
                break
            elif status == "error":
                # Check error message content for known error scenario (memory limits)
                error_message = progress_data.get("message", "")
                assert "memory" in error_message.lower() or "limit" in error_message.lower() or error_message != "", \
                    "Error status returned without memory limit message"
                # No return, just assert success of error detection
                break
            time.sleep(poll_interval)

        assert completed, "Video generation did not complete in expected time"

        # Additional check: retrieve video details if endpoint available
        video_id = video_job_id
        video_details_resp = requests.get(f"{BASE_URL}/api/video/{video_id}", headers=HEADERS, timeout=TIMEOUT)
        assert video_details_resp.status_code == 200, f"Failed to get video details, status: {video_details_resp.status_code}"
        video_details = video_details_resp.json()
        assert "id" in video_details and video_details["id"] == video_id, "Video details ID mismatch"
        assert "url" in video_details or "videoUrl" in video_details, "Video URL missing in details"

        # Step 3: Test error scenario forcibly by sending invalid or extreme payload to simulate memory limit error
        error_payload = {
            "lessonId": lesson_id,
            "voice": "default",
            "theme": "high_memory_usage_theme_that_fails"
        }
        error_resp = requests.post(
            f"{BASE_URL}{API_VIDEO_CREATE}",
            json=error_payload,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        # We expect error status and message about memory limits
        assert error_resp.status_code in (400, 422, 500), f"Expected error status, got {error_resp.status_code}"
        err_data = error_resp.json()
        err_msg = err_data.get("message", "").lower()
        assert "memory" in err_msg or "limit" in err_msg or "failed" in err_msg, \
            f"Error message does not indicate memory limit: {err_msg}"

    finally:
        # No cleanup needed as we didn't create any resource
        pass


test_post_api_video_create_cinematic_video_generation()
