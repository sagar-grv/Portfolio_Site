from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from chat_service import send_chat
from grounding import prime_repo_cache


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ.get("MONGO_URL", "").strip()
db_name = os.environ.get("DB_NAME", "portfolio")

client: AsyncIOMotorClient | None = None
db = None

if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

app = FastAPI(title="Sagar Portfolio API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

_status_memory: List[StatusCheck] = []
_contact_memory: List[ContactMessage] = []


# ---------- Status check (template) ----------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# ---------- Chat models ----------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------- Contact model ----------
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=1, max_length=4000)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Sagar portfolio API is up"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    if db is not None:
        await db.status_checks.insert_one(status_obj.dict())
    else:
        _status_memory.append(status_obj)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is not None:
        rows = await db.status_checks.find().to_list(1000)
        return [StatusCheck(**r) for r in rows]
    return _status_memory[-1000:]


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())
    try:
        reply = await send_chat(session_id, req.message)
    except Exception as exc:  # pragma: no cover
        logger.exception("Chat failure")
        raise HTTPException(status_code=500, detail=f"Chat service error: {exc}")

    # Persist turn in Mongo (best-effort)
    if db is not None:
        try:
            await db.chat_messages.insert_one(
                {
                    "session_id": session_id,
                    "user": req.message,
                    "assistant": reply,
                    "created_at": datetime.utcnow(),
                }
            )
        except Exception as exc:  # pragma: no cover
            logger.warning("Could not persist chat turn: %s", exc)

    return ChatResponse(session_id=session_id, reply=reply)


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(msg: ContactMessageCreate):
    obj = ContactMessage(**msg.dict())
    if db is not None:
        try:
            await db.contact_messages.insert_one(obj.dict())
        except Exception as exc:  # pragma: no cover
            logger.exception("Contact insert failed")
            raise HTTPException(status_code=500, detail=str(exc))
    else:
        _contact_memory.append(obj)
    return obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact():
    if db is not None:
        rows = await db.contact_messages.find().sort("created_at", -1).to_list(200)
        return [ContactMessage(**r) for r in rows]
    return sorted(_contact_memory, key=lambda x: x.created_at, reverse=True)[:200]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def _warmup():
    try:
        await prime_repo_cache()
    except Exception as exc:  # pragma: no cover
        logger.warning("Could not prime GitHub cache at startup: %s", exc)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
