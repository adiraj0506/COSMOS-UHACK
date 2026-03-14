from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/learner", tags=["Learner"])

@router.get("/dashboard")
def learner_dashboard():
    return {
        "readiness_score": 78,
        "roadmap_progress": 52,
        "mentor_insight": "Focus on DSA"
    }