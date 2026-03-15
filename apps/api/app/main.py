from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth
from app.db import init_db
from app.routes import admin, assessment, college, learner, mentor, opportunities, recruiter, rit, roadmap

load_dotenv()

app = FastAPI(title="COSMOS Backend")

# ── CORS ─────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(assessment.router)
app.include_router(rit.router)
app.include_router(mentor.router)
app.include_router(roadmap.router)
app.include_router(recruiter.router)
app.include_router(learner.router)
app.include_router(college.router)
app.include_router(opportunities.router)
app.include_router(admin.router)

# ── Safe Startup ─────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️ Database startup skipped: {e}")

# ── Health Route ─────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "COSMOS backend running"}

@app.get("/health")
def health():
    return {"status": "healthy"}