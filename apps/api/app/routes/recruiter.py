from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/recruiter", tags=["Recruiter"])


class MailPayload(BaseModel):
    to: str
    subject: str
    body: str


@router.get("/profile")
def recruiter_profile():
    return {
        "name": "Arjun Mehta",
        "company": "Razorpay",
        "role": "Senior Talent Acquisition",
        "email": "arjun.mehta@razorpay.com",
        "logo": "R",
        "accentColor": "#f59e0b",
    }


@router.patch("/profile")
def recruiter_profile_update():
    return {"success": True}


@router.get("/jobs")
def recruiter_jobs():
    return {
        "items": [
            {
                "id": "j1",
                "title": "Backend Engineer — Node.js",
                "type": "full-time",
                "department": "Engineering",
                "location": "Bangalore",
                "mode": "hybrid",
                "package": "18–28 LPA",
                "skills": ["Node.js", "PostgreSQL", "Redis", "System Design", "Docker"],
                "description": "Build and scale payment infrastructure serving millions of transactions.",
                "requirements": ["2+ years Node.js", "PostgreSQL experience", "System design knowledge"],
                "status": "active",
                "applicants": 34,
                "matches": 8,
                "postedDate": "Mar 1, 2025",
                "deadline": "Apr 15, 2025",
            }
        ]
    }


@router.get("/talent")
def recruiter_talent(jobId: Optional[str] = Query(None), keywords: Optional[str] = Query(None)):
    return {
        "filters": {"jobId": jobId, "keywords": keywords},
        "items": [
            {
                "id": "t3",
                "name": "Akash Sharma",
                "cosmosId": "CSM-LRN-4821",
                "college": "IIT Bombay",
                "branch": "CSE",
                "batch": "2025",
                "avatar": "AS",
                "readinessScore": 68,
                "resumeScore": 72,
                "skills": ["Node.js", "PostgreSQL", "Docker", "Redis", "Git"],
                "targetRole": "Backend Developer",
                "matchScore": 82,
                "matchLevel": "good",
                "matchedSkills": ["Node.js", "PostgreSQL", "Docker"],
                "missingSkills": ["System Design", "Redis"],
                "email": "akash@iitb.ac.in",
                "contactStatus": "responded",
                "streakDays": 52,
            }
        ],
    }


@router.get("/colleges")
def recruiter_colleges():
    return {
        "items": [
            {
                "id": "c1",
                "name": "IIT Bombay",
                "city": "Mumbai",
                "state": "Maharashtra",
                "logo": "IIT",
                "color": "#a855f7",
                "totalStudents": 342,
                "avgReadiness": 68,
                "avgPackage": 38,
                "placementRate": 72,
                "topSkills": ["Node.js", "Python", "React", "System Design"],
                "contactPerson": "Dr. Ramesh Kumar",
                "contactEmail": "placement@iitb.ac.in",
                "contactStatus": "responded",
                "tier": "Tier 1",
            }
        ]
    }


@router.post("/mail")
def recruiter_mail(payload: MailPayload):
    return {"success": True, "sentTo": payload.to}


@router.get("/matches")
def recruiter_matches():
    return {
        "candidates": [
            {"name": "Candidate A", "match": "82%"}
        ]
    }
