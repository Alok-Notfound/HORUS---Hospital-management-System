from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Auth & Profile"])


class ProfileModel(BaseModel):
    name: str
    email: str
    phone: str
    department: str
    role: str


@router.get("/profile")
def get_profile():
    return {
        "name": "Administrator",
        "email": "admin@horus.health",
        "phone": "+91 98765 43210",
        "department": "Hospital Operations",
        "role": "System Administrator"
    }


@router.post("/profile")
def save_profile(profile: ProfileModel):
    return {"success": True, "profile": profile.dict()}
