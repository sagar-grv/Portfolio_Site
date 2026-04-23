"""NVIDIA NIM-powered chat service for the portfolio.

Primary provider is NVIDIA's OpenAI-compatible API.
Gemini is retained only as a local-development fallback.
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

# session_id -> (conversation history, current model used)
_SESSIONS: Dict[str, Tuple[List[dict], str]] = {}
_SYSTEM_PROMPT: str | None = None
MAX_TURNS = 6

NVIDIA_BASE_URL = os.environ.get("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/")
PRIMARY_MODEL = os.environ.get("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct")

_raw_nvidia_fallbacks = os.environ.get("NVIDIA_FALLBACK_MODELS", "").strip()
NVIDIA_FALLBACK_MODELS = [
    m.strip() for m in _raw_nvidia_fallbacks.split(",") if m.strip()
]

# Gemini is local-only fallback.
GEMINI_FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview"]


async def _ensure_ready() -> str:
    global _SYSTEM_PROMPT
    await prime_repo_cache()
    if _SYSTEM_PROMPT is None:
        _SYSTEM_PROMPT = build_system_prompt()
    return _SYSTEM_PROMPT


def _get_nvidia_api_key() -> str:
    key = os.environ.get("NVIDIA_API_KEY") or os.environ.get("NVIDIA_NIM_API_KEY")
    if not key:
        raise RuntimeError("NVIDIA_API_KEY is not configured on the server.")
    return key


def _get_gemini_api_key() -> str:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server.")
    return key


def _is_local_runtime() -> bool:
    # On Vercel, this env var is present for deployments.
    return not bool(os.environ.get("VERCEL"))


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

    _SESSIONS[session_id] = (
        [{"role": "system", "text": system_prompt}],
        PRIMARY_MODEL,
    )
    return _SESSIONS[session_id]


def _trim_history(history: List[dict]) -> List[dict]:
    if not history:
        return history
    system_msg = history[0] if history[0].get("role") == "system" else None
    convo = history[1:] if system_msg else history
    trimmed = convo[-(MAX_TURNS * 2):]
    return ([system_msg] if system_msg else []) + trimmed


def _to_openai_messages(history: List[dict], user_text: str) -> List[dict]:
    messages: List[dict] = []
    for item in history:
        role = item["role"]
        if role not in {"system", "user", "assistant"}:
            continue
        messages.append({"role": role, "content": item["text"]})

    messages.append({"role": "user", "content": user_text})
    return messages


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


async def _call_nvidia(model: str, history: List[dict], user_text: str) -> str:
    api_key = _get_nvidia_api_key()
    url = f"{NVIDIA_BASE_URL}/chat/completions"
    payload = {
        "model": model,
        "messages": _to_openai_messages(history, user_text),
        "temperature": 0.4,
        "max_tokens": 260,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
    except httpx.TimeoutException as exc:
        raise RuntimeError("NVIDIA request timed out") from exc

    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("NVIDIA API returned no choices")
    msg = choices[0].get("message", {})
    reply = (msg.get("content") or "").strip()
    if not reply:
        raise RuntimeError("NVIDIA API returned an empty response")
    return reply


async def _call_gemini(model: str, history: List[dict], user_text: str) -> str:
    api_key = _get_gemini_api_key()
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = {
        "contents": _to_gemini_contents(history, user_text),
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 350},
    }
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
    except httpx.TimeoutException as exc:
        raise RuntimeError("Gemini request timed out") from exc

    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates")
    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [p.get("text", "") for p in parts if isinstance(p, dict)]
    reply = "".join(text_parts).strip()
    if not reply:
        raise RuntimeError("Gemini returned an empty response")
    return reply


def _is_overloaded(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "429" in msg
        or "503" in msg
        or "timeout" in msg
        or "timed out" in msg
        or "unavailable" in msg
        or "overloaded" in msg
        or "high demand" in msg
        or "rate" in msg and "limit" in msg
    )


async def send_chat(session_id: str, text: str) -> str:
    history, current_model = await get_or_create_chat(session_id)
    await _ensure_ready()
    history = _trim_history(history)

    # Try NVIDIA primary up to 3 times with small backoff.
    last_exc: Exception | None = None
    for attempt in range(3):
        try:
            response = await _call_nvidia(current_model, history, text)
            history.append({"role": "user", "text": text})
            history.append({"role": "assistant", "text": response})
            _SESSIONS[session_id] = (history, current_model)
            return response
        except Exception as exc:  # pragma: no cover - network
            last_exc = exc
            if not _is_overloaded(exc):
                raise
            wait = 0.6 * (2 ** attempt) + random.random() * 0.3
            logger.warning(
                "NVIDIA %s busy (attempt %d): %s; retry in %.1fs",
                current_model, attempt + 1, exc, wait,
            )
            await asyncio.sleep(wait)

    # NVIDIA fallback models (optional).
    for fb in NVIDIA_FALLBACK_MODELS:
        try:
            logger.warning("Falling back to NVIDIA model %s", fb)
            response = await _call_nvidia(fb, history, text)
            history.append({"role": "user", "text": text})
            history.append({"role": "assistant", "text": response})
            _SESSIONS[session_id] = (history, fb)
            return response
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            if not _is_overloaded(exc):
                raise

    # Gemini fallback is local-only.
    if _is_local_runtime() and (os.environ.get("GEMINI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")):
        for fb in GEMINI_FALLBACK_MODELS:
            try:
                logger.warning("Local fallback to Gemini model %s", fb)
                response = await _call_gemini(fb, history, text)
                history.append({"role": "user", "text": text})
                history.append({"role": "assistant", "text": response})
                _SESSIONS[session_id] = (history, fb)
                return response
            except Exception as exc:  # pragma: no cover
                last_exc = exc
                if not _is_overloaded(exc):
                    raise

    raise last_exc or RuntimeError("NVIDIA chat service is currently unavailable")


def reset_chat(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)
