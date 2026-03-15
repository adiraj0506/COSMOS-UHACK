from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth

from app.db import init_db
from app.routes import admin, assessment, college, learner, mentor, opportunities, recruiter, rit, roadmap

load_dotenv()

app = FastAPI(title="COSMOS Backend")

app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router)
app.include_router(rit.router)
app.include_router(mentor.router)
app.include_router(roadmap.router)
app.include_router(recruiter.router)
app.include_router(learner.router)
app.include_router(college.router)
app.include_router(opportunities.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "COSMOS backend running"}
