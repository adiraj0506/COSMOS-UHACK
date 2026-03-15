from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["Admin"])


class DeleteUserPayload(BaseModel):
    id: str


@router.post("/delete-user")
def delete_user(payload: DeleteUserPayload):
    return {"success": True, "deletedId": payload.id}


@router.get("/health")
def admin_health():
    return {"status": "ok"}
