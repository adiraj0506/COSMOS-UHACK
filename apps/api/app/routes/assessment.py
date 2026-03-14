from fastapi import APIRouter
from app.schemas.assessment_schema import AssessmentInput
from app.services.assessment_service import evaluate_answer

router = APIRouter(prefix="/assessment", tags=["Assessment"])

@router.post("/evaluate")
def evaluate(data: AssessmentInput):
    result = evaluate_answer(data.question, data.answer)

    return {
        "user_id": data.user_id,
        "evaluation": result
    }