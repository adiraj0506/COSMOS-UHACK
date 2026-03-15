from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/college", tags=["College"])


@router.get("/profile")
def get_profile():
    return {
        "name": "Indian Institute of Technology Bombay",
        "code": "IITB-2025",
        "city": "Mumbai",
        "state": "Maharashtra",
        "totalStudents": 342,
        "activeBatch": "2025",
        "logoInitial": "IIT",
    }


@router.patch("/profile")
def update_profile():
    return {"success": True}


@router.get("/students")
def list_students(
    batch: Optional[str] = Query(None),
    branch: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    return {
        "filters": {"batch": batch, "branch": branch, "search": search},
        "items": [
            {
                "id": "s1",
                "name": "Akash Sharma",
                "cosmosId": "CSM-LRN-4821",
                "branch": "CSE",
                "batch": "2025",
                "email": "akash@iitb.ac.in",
                "avatar": "AS",
                "readinessScore": 68,
                "readinessLevel": "medium",
                "placementStatus": "in-process",
                "targetRole": "Backend Developer",
                "skills": ["Node.js", "PostgreSQL", "Docker"],
                "streakDays": 52,
                "lastActive": "2h ago",
                "assessmentsDone": 8,
                "roadmapProgress": 62,
                "resumeScore": 72,
                "isAtRisk": False,
            }
        ],
    }


@router.get("/placements")
def list_placements():
    return {
        "items": [
            {
                "id": "p1",
                "studentId": "s2",
                "student": "Priya Nair",
                "company": "Google",
                "role": "SWE",
                "package": "45 LPA",
                "date": "Mar 2025",
                "branch": "CSE",
                "logoColor": "#4285f4",
            }
        ]
    }


@router.get("/analytics/branch")
def branch_analytics():
    return {
        "items": [
            {"branch": "CSE", "total": 142, "avgReadiness": 68, "placed": 38, "atRisk": 8, "color": "#a855f7"},
            {"branch": "IT", "total": 98, "avgReadiness": 55, "placed": 19, "atRisk": 14, "color": "#06b6d4"},
        ]
    }


@router.get("/analytics/trend")
def trend_analytics():
    return {
        "items": [
            {"month": "Oct", "avg": 48, "high": 72, "low": 24},
            {"month": "Nov", "avg": 52, "high": 76, "low": 28},
        ]
    }


@router.get("/analytics/skill-gaps")
def skill_gaps():
    return {
        "items": [
            {"skill": "System Design", "students": 198, "pct": 58, "color": "#a855f7"},
            {"skill": "DSA — Graphs", "students": 167, "pct": 49, "color": "#f43f5e"},
        ]
    }
