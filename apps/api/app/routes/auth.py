from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/signup")
def signup():
    return {"success": True, "message": "Signup working"}

@router.post("/login")
def login():
    return {"success": True, "message": "Login working"}