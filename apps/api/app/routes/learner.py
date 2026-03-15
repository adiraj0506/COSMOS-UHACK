from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, UserGoal
from app.schemas.learner import GoalPatch, GoalPayload

router = APIRouter(prefix="/api/learner", tags=["Learner"])


@router.get("/profile")
def learner_profile(
    cosmos_id: Optional[str] = Query(None, alias="cosmosId"),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    user = None
    if cosmos_id:
        user = db.query(User).filter(User.cosmos_id == cosmos_id).first()
    if not user and email:
        user = db.query(User).filter(User.email == email.lower()).first()

    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found."})

    goal = None
    if user.goal:
        goal = {
            "goal": user.goal.goal,
            "category": user.goal.category,
            "deadline": user.goal.deadline.isoformat(),
            "months": user.goal.months,
            "weeks": user.goal.weeks,
            "days": user.goal.days,
        }

    return {
        "cosmosId": user.cosmos_id,
        "fullName": user.full_name,
        "role": user.role,
        "onboardingComplete": user.onboarding_complete,
        "goal": goal,
    }


@router.post("/onboarding")
def onboarding(payload: GoalPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.cosmos_id == payload.cosmos_id).first()
    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found."})

    if user.goal:
        user.goal.goal = payload.goal
        user.goal.category = payload.category
        user.goal.deadline = payload.deadline
        user.goal.months = payload.months
        user.goal.weeks = payload.weeks
        user.goal.days = payload.days
        user.goal.updated_at = datetime.utcnow()
    else:
        db.add(
            UserGoal(
                user_id=user.id,
                goal=payload.goal,
                category=payload.category,
                deadline=payload.deadline,
                months=payload.months,
                weeks=payload.weeks,
                days=payload.days,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
        )

    user.onboarding_complete = True
    db.commit()

    return {"success": True}


@router.patch("/goal")
def update_goal(payload: GoalPatch, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.cosmos_id == payload.cosmos_id).first()
    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found."})

    if not user.goal:
        return JSONResponse(status_code=404, content={"error": "No goal found to update."})

    if payload.goal is not None:
        user.goal.goal = payload.goal
    if payload.category is not None:
        user.goal.category = payload.category
    if payload.deadline is not None:
        user.goal.deadline = payload.deadline
    if payload.months is not None:
        user.goal.months = payload.months
    if payload.weeks is not None:
        user.goal.weeks = payload.weeks
    if payload.days is not None:
        user.goal.days = payload.days

    user.goal.updated_at = datetime.utcnow()
    db.commit()

    return {"success": True}


@router.get("/roadmap")
def learner_roadmap():
    return {
        "items": [
            {
                "id": "r1",
                "title": "Master Arrays & Strings",
                "category": "DSA",
                "priority": "high",
                "status": "in-progress",
                "deadline": "2025-04-01",
                "progress": 62,
            },
            {
                "id": "r2",
                "title": "Build REST API",
                "category": "System Design",
                "priority": "high",
                "status": "in-progress",
                "deadline": "2025-04-15",
                "progress": 45,
            },
        ]
    }
