from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth

from app.routes import assessment, rit, mentor, roadmap, recruiter

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

@app.get("/")
def root():
    return {"message": "COSMOS backend running"}