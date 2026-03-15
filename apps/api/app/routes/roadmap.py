from fastapi import APIRouter

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


@router.get("/weekly")
def weekly_plan():
    return {
        "tasks": [
            "Solve 5 DSA questions",
            "Build auth API",
        ]
    }
