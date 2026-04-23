from fastapi.testclient import TestClient

from backend import server


def test_chat_rate_limit_returns_friendly_message(monkeypatch):
    async def _boom(session_id: str, text: str):
        raise RuntimeError(
            "Client error '429 Too Many Requests' for url "
            "'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=SECRET'"
        )

    monkeypatch.setattr(server, "send_chat", _boom)

    with TestClient(server.app) as client:
        response = client.post(
            "/api/chat",
            json={"message": "hi", "session_id": "t-1"},
        )

    assert response.status_code == 503
    body = response.json()
    assert "detail" in body
    assert "Try again in a moment" in body["detail"]
    assert "Too Many Requests" not in body["detail"]
    assert "generativelanguage.googleapis.com" not in body["detail"]
