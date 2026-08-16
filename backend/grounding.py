"""Grounding context for the Sagar portfolio chatbot.

Contains a concise, structured summary of the resume and lightweight metadata
about key GitHub repositories. READMEs for the top repos are fetched lazily
from GitHub and cached for the process lifetime.
"""

from __future__ import annotations

import logging
import asyncio
from typing import Dict, List

import httpx

logger = logging.getLogger(__name__)

RESUME_CONTEXT = """
# Sagar Gurav — Portfolio and Resume Context

## Profile
AI and Machine Learning engineer focused on agentic workflows, computer vision,
data products and the product engineering needed to make them useful. Sagar
combines applied AI, backend development, analytics and clear interfaces, with
an emphasis on honest evaluation, secure defaults and evidence-backed claims.

## Contact
- Email: sagargurav1812@gmail.com
- Location: Shirpur, India
- GitHub: https://github.com/sagar-grv
- LinkedIn: https://www.linkedin.com/in/sagargrv/
- Medium: https://medium.com/@sagargurav1812
- Instagram: https://www.instagram.com/sagar_grv/

## Education
- B.Tech, Artificial Intelligence & Machine Learning — SVKM'S NMIMS MPSTME,
  Shirpur (Jul 2023 – Present). CGPA 2.89 / 4.0. Class of 2027.
- Class XII (Science), Indirapuram Public School — 82.83% (2022–2023).
- Class X, Indirapuram Public School — 87.20% (2020–2021).

## Skills
- AI Engineering: LLMs and RAG, agentic workflows, computer vision, model
  evaluation, PyTorch, TensorFlow, OpenCV and scikit-learn.
- Data and Analytics: Python, SQL, Pandas, NumPy, Power BI, Plotly and EDA.
- Product Engineering: React, FastAPI, Streamlit, Flask, APIs, PostgreSQL,
  Supabase and Neo4j.
- Quality and Delivery: Pytest, Playwright, Docker, GitHub Actions, Git,
  documentation and cloud deployment.

## Selected Projects
1. AI TestPilot X — autonomous QA platform and published Python CLI that turns
   a plain-English user story into a 10-agent test pipeline. It generates test
   cases, runs browser workflows, analyses bugs and produces release decisions.
   Stack: Python, LangGraph, Playwright, Pytest and Streamlit.
2. HealthVault — AI-powered medical record management for Indian patients and
   doctors. It supports report scanning, explanations in 12 Indian languages,
   Health ID and QR sharing, access controls, row-level security and audit logs.
   Stack: Next.js, Supabase, PostgreSQL and Gemini.
3. PrivateVoice Docs — local-first document intelligence PWA with document
   storage in IndexedDB, local retrieval and visible source excerpts. It sends
   only selected excerpts to a user-chosen model and has an Android foundation
   with no INTERNET permission.
4. Clinical Trial Intelligence — evidence-backed clinical-trial quality and
   risk analysis combining deterministic rules, role-based views, cross-study
   comparison and human-approved agentic assistance. It is decision support,
   not a replacement for clinical judgment.
5. Siamese Person Re-ID — EfficientNet-B0 comparison of triplet and contrastive
   loss using 512-dimensional embeddings, with GPU acceleration, AMP and a
   Streamlit comparison interface.
6. UIDAI Analytics — forensic Aadhaar analytics using Benford's Law, Gini
   concentration analysis, anomaly exploration and Random Forest demand
   forecasting in an interactive Streamlit dashboard.

## Experience
- Shopify Web Developer Intern (Dec 2025 – Feb 2026): built and optimised
  e-commerce websites to load 40% faster; used analytics to help 5+ online
  stores rank higher on Google and keep customers happy.
- Google Student Ambassador — College Coordinator (Jul 2025 – Jul 2026):
  taught 200+ students about Google Cloud and AI; organised 4 major workshops
  and hackathons.

## Certifications & Achievements
- AI Agents Intensive Course with Google — Kaggle x Google.
- SIH 2025 Internal Hackathon — Finalist Team.
- Generative AI Mastermind — Outskill.
- EY Techathon 6.0 — Certificate of Appreciation.
""".strip()


# Repositories displayed as selected work on the portfolio.
PRIORITY_REPOS: List[str] = [
    "ai-testpilot-x",
    "healthvault",
    "privatevoice-docs",
    "clinical-trial-intelligence-nest2.0",
    "Siamese-Person-ReID",
    "uidai-analytics",
]

GITHUB_USER = "sagar-grv"

_readme_cache: Dict[str, str] = {}
_cache_ready = False
_cache_lock = asyncio.Lock()


async def _fetch_readme(client: httpx.AsyncClient, repo: str) -> str:
    """Fetch a repo README from GitHub raw, trying main then master."""
    for branch in ("main", "master"):
        url = f"https://raw.githubusercontent.com/{GITHUB_USER}/{repo}/{branch}/README.md"
        try:
            r = await client.get(url, timeout=10.0)
            if r.status_code == 200 and r.text.strip():
                return r.text[:3500]
        except Exception as exc:  # pragma: no cover
            logger.warning("README fetch failed for %s@%s: %s", repo, branch, exc)
    return ""


async def prime_repo_cache() -> None:
    """Prefetch READMEs for priority repos (best-effort)."""
    global _cache_ready
    async with _cache_lock:
        if _cache_ready:
            return
        async with httpx.AsyncClient(follow_redirects=True) as client:
            coros = [_fetch_readme(client, r) for r in PRIORITY_REPOS]
            results = await asyncio.gather(*coros, return_exceptions=True)
        for repo, res in zip(PRIORITY_REPOS, results):
            if isinstance(res, Exception):
                _readme_cache[repo] = ""
            else:
                _readme_cache[repo] = res or ""
        _cache_ready = True
        have = sum(1 for v in _readme_cache.values() if v)
        logger.info("Primed GitHub README cache: %d/%d", have, len(PRIORITY_REPOS))


def build_github_context() -> str:
    if not _readme_cache:
        return ""
    blocks: List[str] = []
    for repo in PRIORITY_REPOS:
        content = _readme_cache.get(repo, "").strip()
        if not content:
            continue
        blocks.append(
            f"### Repo: {repo}\nURL: https://github.com/{GITHUB_USER}/{repo}\n\n{content}"
        )
    if not blocks:
        return ""
    return "## Notable GitHub Repositories (READMEs)\n\n" + "\n\n---\n\n".join(blocks)


def build_system_prompt() -> str:
    gh = build_github_context()
    gh_section = f"\n\n{gh}" if gh else ""
    return f"""You are "Sagar's AI" — a concise, friendly assistant embedded on
Sagar Gurav's portfolio website. Your job is to help recruiters, collaborators
and visitors learn about Sagar's background, skills, projects and experience.

Ground every answer ONLY in the information below (resume + public GitHub
READMEs). If something is not covered, say so honestly and suggest contacting
Sagar at sagargurav1812@gmail.com or via LinkedIn.

Style:
- Answer in first person as Sagar's assistant ("Sagar has...", "In this
  project he..."). Do NOT pretend to be Sagar himself.
- Use a professional, warm, and natural tone suitable for recruiters and
    collaborators.
- Prefer short paragraph-style responses over bullet lists. Use bullets only
    when the user explicitly asks for a list or comparison table.
- If the user asks a yes/no question, start with a clear direct answer in one
    sentence, then add concise context.
- Keep responses short, crisp, and on-point: prefer 2-4 sentences, usually
    under 70 words unless the user asks for detail.
- Avoid filler, repetition, and long lead-ins. Do not add extra sections unless
    requested.
- Use plain conversational prose by default (no markdown formatting symbols).
- When you cite a project, mention the tech stack and a headline metric if
  available.
- Never invent accuracies, dates, companies, or certifications that are not
  present in the grounding.

---

{RESUME_CONTEXT}{gh_section}
""".strip()
