"""Gemini-powered chat service for the portfolio.

Uses Gemini's public REST API directly so deployment does not depend on
third-party wrappers that may be unavailable in some runtimes.
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

# Primary + fallback models. If the primary 503s, we transparently fall back.
PRIMARY_MODEL = "gemini-2.5-flash"
FALLBACK_MODELS = ["gemini-2.5-pro", "gemini-3-flash-preview"]


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


def _is_overloaded(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "503" in msg
        or "unavailable" in msg
        or "overloaded" in msg
        or "high demand" in msg
        or "rate" in msg and "limit" in msg
    )


async def send_chat(session_id: str, text: str) -> str:
    history, current_model = await get_or_create_chat(session_id)
    await _ensure_ready()
    history = _trim_history(history)

    # Try primary up to 3 times with small backoff, then fall back.
    last_exc: Exception | None = None
    for attempt in range(3):
        try:
            response = await _call_gemini(current_model, history, text)
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
                "Gemini %s busy (attempt %d): %s; retry in %.1fs",
                current_model, attempt + 1, exc, wait,
            )
            await asyncio.sleep(wait)

    # Fallback models
    for fb in FALLBACK_MODELS:
        try:
            logger.warning("Falling back to %s", fb)
            response = await _call_gemini(fb, history, text)
            history.append({"role": "user", "text": text})
            history.append({"role": "assistant", "text": response})
            _SESSIONS[session_id] = (history, fb)
            return response
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            if not _is_overloaded(exc):
                raise

    raise last_exc or RuntimeError("Gemini is currently unavailable")


def reset_chat(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)
