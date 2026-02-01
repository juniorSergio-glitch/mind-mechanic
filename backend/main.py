from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "*", # Allow all origins for production (Vercel)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class FocusSession(BaseModel):
    id: str
    duration_minutes: int
    completed_at: datetime
    xp_earned: int

class SessionCreate(BaseModel):
    duration_minutes: int

class ThoughtInput(BaseModel):
    text: str

class TaskItem(BaseModel):
    id: str
    text: str
    is_completed: bool

# --- In-Memory Database (for MVP) ---
sessions_db: List[FocusSession] = []
user_xp = 0

# --- Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Mecânica da Mente API"}

@app.post("/sessions", response_model=FocusSession)
def create_session(session: SessionCreate):
    global user_xp
    
    # Calculate XP (10 XP per minute of focus)
    xp_earned = session.duration_minutes * 10
    user_xp += xp_earned
    
    new_session = FocusSession(
        id=str(uuid.uuid4()),
        duration_minutes=session.duration_minutes,
        completed_at=datetime.now(),
        xp_earned=xp_earned
    )
    
    sessions_db.append(new_session)
    return new_session

@app.get("/user/status")
def get_user_status():
    level = 1 + (user_xp // 1000)
    return {
        "xp": user_xp,
        "level": level,
        "total_sessions": len(sessions_db)
    }

@app.post("/scanner/process", response_model=List[TaskItem])
def process_thoughts(input: ThoughtInput):
    # Simple logic: Split by commas or newlines
    # In the future, this is where LLM logic would go
    raw_tasks = [t.strip() for t in input.text.replace('\n', ',').split(',') if t.strip()]
    
    processed_tasks = []
    for t in raw_tasks:
        processed_tasks.append(TaskItem(
            id=str(uuid.uuid4()),
            text=t,
            is_completed=False
        ))
        
    return processed_tasks
