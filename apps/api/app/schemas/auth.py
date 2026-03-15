from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SignupRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(..., alias="fullName", min_length=1, max_length=255)
    email: str
    password: str = Field(..., min_length=8)
    role: str

    cosmos_id: Optional[str] = Field(None, alias="cosmosId")
    company_name: Optional[str] = Field(None, alias="companyName")
    college_name: Optional[str] = Field(None, alias="collegeName")
    city: Optional[str] = None
    invite_code: Optional[str] = Field(None, alias="inviteCode")


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    role: Optional[str] = None
    cosmos_id: Optional[str] = Field(None, alias="cosmosId")
    error: Optional[str] = None
