from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import RitResult, User
from app.schemas.rit import RitSubmitRequest

router = APIRouter(prefix="/api/rit", tags=["RIT"])


@router.post("/submit")
def submit_rit(payload: RitSubmitRequest, db: Session = Depends(get_db)):
    product_job = payload.product_job if payload.product_job is not None else 72
    research = payload.research if payload.research is not None else 14
    startup = payload.startup if payload.startup is not None else 14

    user_id = None
    if payload.cosmos_id:
        user = db.query(User).filter(User.cosmos_id == payload.cosmos_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"error": "User not found."})
        user_id = user.id

    if user_id:
        db.add(
            RitResult(
                user_id=user_id,
                product_job=product_job,
                research=research,
                startup=startup,
            )
        )
        db.commit()

    return {
        "product_job": product_job,
        "research": research,
        "startup": startup,
    }
