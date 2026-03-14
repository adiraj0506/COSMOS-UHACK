from fastapi import APIRouter

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])

@router.get("/matches")
def recruiter_matches():
    return {
        "candidates": [
            {"name": "Candidate A", "match": "82%"}
        ]
    }