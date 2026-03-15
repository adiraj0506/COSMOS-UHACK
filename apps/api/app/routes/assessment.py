from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query

from app.schemas.assessment_schema import AssessmentInput
from app.services.assessment_service import evaluate_answer

router = APIRouter(prefix="/api/assessment", tags=["Assessment"])


@router.get("/questions")
def get_questions(goal: Optional[str] = Query(None), topics: Optional[str] = Query(None)):
    return {
        "goal": goal,
        "topics": topics,
        "questions": [
            {
                "id": 1,
                "text": "Given a binary tree, find its maximum depth. Explain your approach and write the code.",
                "code": "def max_depth(root):\n    if not root:\n        return 0\n    left = max_depth(root.left)\n    right = max_depth(root.right)\n    return 1 + max(left, right)",
            },
            {
                "id": 2,
                "text": "Implement a function to check if a linked list has a cycle. What is the time and space complexity?",
                "code": "def has_cycle(head):\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False",
            },
            {
                "id": 3,
                "text": "Design a rate limiter using the sliding window algorithm. Write the core logic.",
                "code": "class RateLimiter:\n    def __init__(self, limit, window):\n        self.limit = limit\n        self.window = window\n        self.log = []",
            },
        ],
    }


@router.post("/evaluate")
def evaluate(data: AssessmentInput):
    result = evaluate_answer(data.question, data.answer)

    return {
        "user_id": data.user_id,
        "evaluation": result,
    }
