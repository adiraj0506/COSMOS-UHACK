from __future__ import annotations

import random
from datetime import datetime

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User
from app.schemas.auth import LoginRequest, SignupRequest
from app.security import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["Auth"])

ROLE_PREFIX = {
    "learner": "LRN",
    "recruiter": "RCT",
    "college": "CLG",
    "admin": "ADM",
}


def generate_cosmos_id(role: str, db: Session) -> str:
    prefix = ROLE_PREFIX.get(role, "USR")
    while True:
        digits = random.randint(1000, 9999)
        cosmos_id = f"CSM-{prefix}-{digits}"
        exists = db.query(User).filter(User.cosmos_id == cosmos_id).first()
        if not exists:
            return cosmos_id


@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    role = payload.role.strip().lower()
    if role not in ROLE_PREFIX:
        return JSONResponse(status_code=400, content={"error": "Invalid role selected."})

    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        return JSONResponse(status_code=400, content={"error": "Email already registered."})

    cosmos_id = payload.cosmos_id
    if cosmos_id:
        conflict = db.query(User).filter(User.cosmos_id == cosmos_id).first()
        if conflict:
            cosmos_id = None

    if not cosmos_id:
        cosmos_id = generate_cosmos_id(role, db)

    password_hash, password_salt = hash_password(payload.password)

    user = User(
        cosmos_id=cosmos_id,
        email=payload.email.lower(),
        full_name=payload.full_name.strip(),
        role=role,
        password_hash=password_hash,
        password_salt=password_salt,
        company_name=payload.company_name,
        college_name=payload.college_name,
        city=payload.city,
        invite_code=payload.invite_code,
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()

    return {
        "role": user.role,
        "cosmosId": user.cosmos_id,
        "fullName": user.full_name,
        "companyName": user.company_name,
        "collegeName": user.college_name,
        "city": user.city,
    }


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash, user.password_salt):
        return JSONResponse(status_code=401, content={"error": "Invalid email or password."})

    user.last_login_at = datetime.utcnow()
    db.commit()

    return {
        "role": user.role,
        "cosmosId": user.cosmos_id,
        "fullName": user.full_name,
        "companyName": user.company_name,
        "collegeName": user.college_name,
        "city": user.city,
    }
