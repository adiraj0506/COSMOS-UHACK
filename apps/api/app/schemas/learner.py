from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class GoalPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    cosmos_id: str = Field(..., alias="cosmosId")
    goal: str
    category: str
    deadline: date
    months: int
    weeks: int
    days: int


class GoalPatch(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    cosmos_id: str = Field(..., alias="cosmosId")
    goal: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[date] = None
    months: Optional[int] = None
    weeks: Optional[int] = None
    days: Optional[int] = None


class GoalResponse(BaseModel):
    goal: str
    category: str
    deadline: date
    months: int
    weeks: int
    days: int


class ProfileResponse(BaseModel):
    cosmos_id: str = Field(..., alias="cosmosId")
    full_name: str = Field(..., alias="fullName")
    role: str
    onboarding_complete: bool = Field(..., alias="onboardingComplete")
    goal: Optional[GoalResponse] = None
