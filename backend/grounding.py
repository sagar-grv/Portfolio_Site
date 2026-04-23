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
# Sagar Gurav — Resume

## Profile
Innovative AI and Machine Learning Engineer with a passion for web development.
Skilled in building predictive models and cloud systems using Python and
TensorFlow. Experienced in creating fast and user-friendly e-commerce websites
to boost online sales. Loves using data to solve real problems and help
businesses make smart choices.

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
- Machine Learning: TensorFlow, Keras, Scikit-learn, PyTorch, CNN, NLP,
  Computer Vision, Generative AI, OpenCV.
- Languages: Python, JavaScript, C++, R, SQL, HTML5, CSS3, Liquid.
- Data & Analytics: Pandas, NumPy, Matplotlib, Plotly, Power BI, EDA, MySQL,
  Neo4j.
- Tools & Cloud: Git, GitHub, Streamlit, VS Code, Google Cloud, Firebase,
  Vercel, Render, Docker, Streamlit.
- Soft skills: Leadership, Teamwork, Communication, Time Management.

## Projects
1. Person Re-Identification System (Deep Learning, Computer Vision) — deep
   learning model extracting 512-dimensional features and matching people with
   ~89% accuracy. Web app processes 30+ frames per second where users upload
   photos and find matches in real time.
2. BankAssist Enterprise (GenAI, Multi-Agent Systems) — smart banking
   chatbot built with Google Gemini that automates 85% of routine customer
   support queries. Reduced API calls by 66% and cut customer wait times by
   40% through agent orchestration + caching.
3. Deepfake Detection System (Computer Vision) — CNN-based detector for
   manipulated images/videos with ~85% accuracy, trained on 10,000+ media
   files. Surfaces frame-level anomalies.
4. Ayush Synapse (Healthcare AI) — system that connects traditional AYUSH
   medicine data with modern healthcare records for 500+ patient profiles.
   Integrates NAMASTE and ICD-11 coding standards for safe cross-database
   sharing.

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


# Repos prioritised for today's (AIML / GenAI / full-stack) focus.
PRIORITY_REPOS: List[str] = [
    "ayush-synapse",
    "hackrx-final-project",
    "sagar-grv",
    "contact-book",
    "DSA_Event_Scheduler_CPP",
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
                return r.text[:6000]
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
- Keep replies concise and polished (typically 80-140 words) unless the user
    explicitly asks for more detail.
- When you cite a project, mention the tech stack and a headline metric if
  available.
- Never invent accuracies, dates, companies, or certifications that are not
  present in the grounding.

---

{RESUME_CONTEXT}{gh_section}
""".strip()
