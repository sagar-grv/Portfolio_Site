"""NVIDIA NIM-powered chat service for the portfolio.

Primary provider is NVIDIA's OpenAI-compatible API.
Gemini is retained only as a local-development fallback.
"""

from __future__ import annotations

import asyncio
import logging
import os
import random
import re
from typing import Dict, List, Tuple

import httpx

from grounding import build_system_prompt, prime_repo_cache

logger = logging.getLogger(__name__)

# session_id -> (conversation history, current model used)
_SESSIONS: Dict[str, Tuple[List[dict], str]] = {}
_SYSTEM_PROMPT: str | None = None
MAX_TURNS = int(os.environ.get("CHAT_MAX_TURNS", "4"))
MAX_INPUT_CHARS = int(os.environ.get("CHAT_MAX_INPUT_CHARS", "600"))
NVIDIA_MAX_TOKENS = int(os.environ.get("NVIDIA_MAX_TOKENS", "180"))
NVIDIA_TIMEOUT_SECONDS = float(os.environ.get("NVIDIA_TIMEOUT_SECONDS", "25"))
NVIDIA_RETRIES = int(os.environ.get("NVIDIA_RETRIES", "2"))

NVIDIA_BASE_URL = os.environ.get("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/")
PRIMARY_MODEL = os.environ.get("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct")

_raw_nvidia_fallbacks = os.environ.get("NVIDIA_FALLBACK_MODELS", "").strip()
NVIDIA_FALLBACK_MODELS = [
    m.strip() for m in _raw_nvidia_fallbacks.split(",") if m.strip()
]

# Gemini is local-only fallback.
GEMINI_FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview"]

PORTFOLIO_KEYWORDS = {
    "sagar", "portfolio", "project", "projects", "resume", "cv", "experience",
    "internship", "skills", "github", "contact", "education", "shopify", "bankassist",
    "deepfake", "ayush", "synapse", "re-identification", "certification", "achievement",
}

OFF_TOPIC_HINTS = {
    "weather", "temperature", "sports", "cricket", "football", "movie", "recipe",
    "stock", "bitcoin", "news", "capital of", "who is the president", "translate",
    "solve this math", "write code", "politics",
}

INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior)\s+instructions", re.IGNORECASE),
    re.compile(r"disregard\s+the\s+above", re.IGNORECASE),
    re.compile(r"reveal\s+(your|the)\s+system\s+prompt", re.IGNORECASE),
    re.compile(r"developer\s+message", re.IGNORECASE),
    re.compile(r"jailbreak|do\s+anything\s+now|dan\b", re.IGNORECASE),
]


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


def _normalize_user_text(text: str) -> str:
    clean = (text or "").strip()
    if len(clean) > MAX_INPUT_CHARS:
        clean = clean[:MAX_INPUT_CHARS]
    return clean


def _is_prompt_injection(text: str) -> bool:
    return any(p.search(text) for p in INJECTION_PATTERNS)


def _is_out_of_scope(text: str) -> bool:
    low = text.lower()
    if any(k in low for k in PORTFOLIO_KEYWORDS):
        return False
    return any(h in low for h in OFF_TOPIC_HINTS)


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
        "temperature": 0.2,
        "max_tokens": NVIDIA_MAX_TOKENS,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=NVIDIA_TIMEOUT_SECONDS) as client:
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
    text = _normalize_user_text(text)
    if not text:
        return "Please share a short question about Sagar's portfolio, projects, or experience."

    history, current_model = await get_or_create_chat(session_id)
    await _ensure_ready()
    history = _trim_history(history)

    if _is_prompt_injection(text):
        response = (
            "I can not follow prompt-override or hidden-instruction requests. "
            "Please ask about Sagar's projects, skills, or experience."
        )
        history.append({"role": "user", "text": text})
        history.append({"role": "assistant", "text": response})
        _SESSIONS[session_id] = (history, current_model)
        return response

    if _is_out_of_scope(text):
        response = (
            "I can only answer questions related to Sagar's portfolio, resume, and public projects. "
            "Please ask about his skills, experience, or project work."
        )
        history.append({"role": "user", "text": text})
        history.append({"role": "assistant", "text": response})
        _SESSIONS[session_id] = (history, current_model)
        return response

    # Try NVIDIA primary up to 3 times with small backoff.
    last_exc: Exception | None = None
    for attempt in range(NVIDIA_RETRIES):
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
            wait = 0.25 * (2 ** attempt) + random.random() * 0.2
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
