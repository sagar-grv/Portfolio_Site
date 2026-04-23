"""Gemini-powered chat service for the portfolio.

Uses the emergentintegrations LlmChat wrapper. Each session_id gets its own
LlmChat instance (the library manages multi-turn history internally).
"""

from __future__ import annotations

import asyncio
import logging
import os
import random
from typing import Dict, Tuple

from emergentintegrations.llm.chat import LlmChat, UserMessage

from grounding import build_system_prompt, prime_repo_cache

logger = logging.getLogger(__name__)

# session_id -> (chat instance, current model used)
_SESSIONS: Dict[str, Tuple[LlmChat, str]] = {}
_SYSTEM_PROMPT: str | None = None

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


def _make_chat(session_id: str, system_prompt: str, model: str) -> LlmChat:
    return LlmChat(
        api_key=_get_api_key(),
        session_id=session_id,
        system_message=system_prompt,
    ).with_model("gemini", model)


async def get_or_create_chat(session_id: str) -> Tuple[LlmChat, str]:
    if session_id in _SESSIONS:
        return _SESSIONS[session_id]
    system_prompt = await _ensure_ready()
    chat = _make_chat(session_id, system_prompt, PRIMARY_MODEL)
    _SESSIONS[session_id] = (chat, PRIMARY_MODEL)
    return _SESSIONS[session_id]


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
    chat, current_model = await get_or_create_chat(session_id)
    system_prompt = await _ensure_ready()
    msg = UserMessage(text=text)

    # Try primary up to 3 times with small backoff, then fall back.
    last_exc: Exception | None = None
    for attempt in range(3):
        try:
            response = await chat.send_message(msg)
            return response if isinstance(response, str) else str(response)
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
            fb_chat = _make_chat(session_id, system_prompt, fb)
            response = await fb_chat.send_message(msg)
            _SESSIONS[session_id] = (fb_chat, fb)
            return response if isinstance(response, str) else str(response)
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            if not _is_overloaded(exc):
                raise

    raise last_exc or RuntimeError("Gemini is currently unavailable")


def reset_chat(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)
