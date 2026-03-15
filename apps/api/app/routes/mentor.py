from fastapi import APIRouter

router = APIRouter(prefix="/api/mentor", tags=["Mentor"])


@router.post("/ask")
def ask_mentor():
    return {
        "response": "Focus on backend and DSA."
    }
