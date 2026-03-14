from pydantic import BaseModel

class AssessmentInput(BaseModel):
    question: str
    answer: str
    user_id: str