import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = FastAPI(title="MeetMates API")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173"), "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к Supabase
supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)

from routers import users, matches, ratings

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["ratings"])


@app.get("/")
def root():
    return {"status": "ok", "app": "MeetMates API"}
