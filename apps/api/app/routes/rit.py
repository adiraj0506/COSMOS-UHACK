from fastapi import APIRouter

router = APIRouter(prefix="/rit", tags=["RIT"])

@router.post("/submit")
def submit_rit():
    return {
        "product_job": 72,
        "research": 14,
        "startup": 14
    }