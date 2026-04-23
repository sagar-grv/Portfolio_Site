"""Chat service for the portfolio.

Primary provider is NVIDIA NIM (OpenAI-compatible API), with Gemini as a
fallback provider when NVIDIA is unavailable or not configured.
"""

from __future__ import annotations

import asyncio
import logging
import os
import random
from typing import Dict, List, Tuple

import httpx

from grounding import build_system_prompt, prime_repo_cache

logger = logging.getLogger(__name__)

# session_id -> (conversation history, current model reference)
_SESSIONS: Dict[str, Tuple[List[dict], str]] = {}
_SYSTEM_PROMPT: str | None = None
MAX_TURNS = 6

NVIDIA_DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_DEFAULT_MODEL = "meta/llama-3.1-70b-instruct"
GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview"]


async def _ensure_ready() -> str:
    global _SYSTEM_PROMPT
    await prime_repo_cache()
    if _SYSTEM_PROMPT is None:
        _SYSTEM_PROMPT = build_system_prompt()
    return _SYSTEM_PROMPT


def _get_api_key() -> str:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server.")
    return key


def _get_nvidia_api_key() -> str:
    key = os.environ.get("NVIDIA_API_KEY", "").strip()
    if not key:
        raise RuntimeError("NVIDIA_API_KEY is not configured on the server.")
    return key


def _get_nvidia_base_url() -> str:
    return os.environ.get("NVIDIA_BASE_URL", NVIDIA_DEFAULT_BASE_URL).rstrip("/")


def _get_nvidia_model() -> str:
    return os.environ.get("NVIDIA_MODEL", NVIDIA_DEFAULT_MODEL)


def _make_model_ref(provider: str, model: str) -> str:
    return f"{provider}:{model}"


def _parse_model_ref(model_ref: str) -> Tuple[str, str]:
    if ":" not in model_ref:
        return "gemini", model_ref
    provider, model = model_ref.split(":", 1)
    return provider, model


def _pick_initial_model_ref() -> str:
    if os.environ.get("NVIDIA_API_KEY", "").strip():
        return _make_model_ref("nvidia", _get_nvidia_model())
    return _make_model_ref("gemini", GEMINI_MODELS[0])


async def get_or_create_chat(session_id: str) -> Tuple[List[dict], str]:
    system_prompt = await _ensure_ready()
    if session_id in _SESSIONS:
        history, model = _SESSIONS[session_id]
        # If prompt rules changed between deployments, apply the latest style.
        if not history or history[0].get("role") != "system":
            history = [{"role": "system", "text": system_prompt}] + history
        elif history[0].get("text") != system_prompt:
            history[0]["text"] = system_prompt
        _SESSIONS[session_id] = (history, model)
        return _SESSIONS[session_id]

    _SESSIONS[session_id] = ([{"role": "system", "text": system_prompt}], _pick_initial_model_ref())
    return _SESSIONS[session_id]


def _trim_history(history: List[dict]) -> List[dict]:
    if not history:
        return history
    system_msg = history[0] if history[0].get("role") == "system" else None
    convo = history[1:] if system_msg else history
    trimmed = convo[-(MAX_TURNS * 2):]
    return ([system_msg] if system_msg else []) + trimmed


def _to_gemini_contents(history: List[dict], user_text: str) -> List[dict]:
    contents: List[dict] = []
    for item in history:
        if item["role"] == "system":
            contents.append(
                {
                    "role": "user",
                    "parts": [{"text": f"System instruction:\n{item['text']}"}],
                }
            )
            continue
        role = "user" if item["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": item["text"]}]})

    contents.append({"role": "user", "parts": [{"text": user_text}]})
    return contents


async def _call_gemini(model: str, history: List[dict], user_text: str) -> str:
    api_key = _get_api_key()
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = {
        "contents": _to_gemini_contents(history, user_text),
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 350},
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()

    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates")
    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [p.get("text", "") for p in parts if isinstance(p, dict)]
    reply = "".join(text_parts).strip()
    if not reply:
        raise RuntimeError("Gemini returned an empty response")
    return reply


def _to_openai_messages(history: List[dict], user_text: str) -> List[dict]:
    messages: List[dict] = []
    for item in history:
        role = item.get("role", "user")
        text = item.get("text", "")
        if role not in {"system", "user", "assistant"}:
            continue
        messages.append({"role": role, "content": text})
    messages.append({"role": "user", "content": user_text})
    return messages


def _extract_openai_content(message_content) -> str:
    if isinstance(message_content, str):
        return message_content.strip()
    if isinstance(message_content, list):
        parts: List[str] = []
        for item in message_content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "".join(parts).strip()
    return ""


async def _call_nvidia(model: str, history: List[dict], user_text: str) -> str:
    url = f"{_get_nvidia_base_url()}/chat/completions"
    headers = {
        "Authorization": f"Bearer {_get_nvidia_api_key()}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": _to_openai_messages(history, user_text),
        "temperature": 0.4,
        "max_tokens": 350,
    }
    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("NVIDIA API returned no choices")
    message = choices[0].get("message", {})
    reply = _extract_openai_content(message.get("content"))
    if not reply:
        raise RuntimeError("NVIDIA API returned an empty response")
    return reply


def _is_overloaded(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "503" in msg
        or "429" in msg
        or "unavailable" in msg
        or "overloaded" in msg
        or "high demand" in msg
        or "rate" in msg and "limit" in msg
    )


async def _call_provider(model_ref: str, history: List[dict], text: str) -> str:
    provider, model = _parse_model_ref(model_ref)
    if provider == "nvidia":
        return await _call_nvidia(model, history, text)
    return await _call_gemini(model, history, text)


async def send_chat(session_id: str, text: str) -> str:
    history, current_model_ref = await get_or_create_chat(session_id)
    await _ensure_ready()
    history = _trim_history(history)

    # Try current provider up to 3 times with small backoff.
    last_exc: Exception | None = None
    for attempt in range(3):
        try:
            response = await _call_provider(current_model_ref, history, text)
            history.append({"role": "user", "text": text})
            history.append({"role": "assistant", "text": response})
            _SESSIONS[session_id] = (history, current_model_ref)
            return response
        except Exception as exc:  # pragma: no cover - network
            last_exc = exc
            if not _is_overloaded(exc):
                raise
            wait = 0.6 * (2 ** attempt) + random.random() * 0.3
            provider, model = _parse_model_ref(current_model_ref)
            logger.warning(
                "%s %s busy (attempt %d): %s; retry in %.1fs",
                provider, model, attempt + 1, exc, wait,
            )
            await asyncio.sleep(wait)

    # Fallback to Gemini models (or remaining Gemini models if already on Gemini).
    _, current_model_name = _parse_model_ref(current_model_ref)
    gemini_candidates = [
        m for m in GEMINI_MODELS if _make_model_ref("gemini", m) != current_model_ref
    ]

    for fb in gemini_candidates:
        try:
            logger.warning("Falling back to Gemini model %s", fb)
            fb_ref = _make_model_ref("gemini", fb)
            response = await _call_provider(fb_ref, history, text)
            history.append({"role": "user", "text": text})
            history.append({"role": "assistant", "text": response})
            _SESSIONS[session_id] = (history, fb_ref)
            return response
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            if not _is_overloaded(exc):
                raise

    raise last_exc or RuntimeError("Gemini is currently unavailable")


def reset_chat(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)
