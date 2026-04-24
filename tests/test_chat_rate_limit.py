from fastapi.testclient import TestClient

from backend import server


def test_chat_rate_limit_blocks_excess_requests(monkeypatch):
    async def _ok(session_id: str, text: str):
        return "ok"

    monkeypatch.setattr(server, "send_chat", _ok)
    monkeypatch.setattr(server, "CHAT_RATE_IP_LIMIT", 1)
    monkeypatch.setattr(server, "CHAT_RATE_SESSION_LIMIT", 10)
    server._RATE_WINDOWS.clear()

    with TestClient(server.app) as client:
        first = client.post("/api/chat", json={"message": "hello", "session_id": "s-1"})
        second = client.post("/api/chat", json={"message": "hello again", "session_id": "s-2"})

    assert first.status_code == 200
    assert second.status_code == 429
    assert "too many chat requests" in second.json()["detail"].lower()
