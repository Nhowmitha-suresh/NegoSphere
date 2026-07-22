from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(req: LoginRequest):
    return {
        "status": "success",
        "user": {
            "id": "demo-user-123",
            "name": "Deloitte Recruiter / Interviewer",
            "email": req.email,
            "role": "Lead Architect"
        },
        "token": "demo-jwt-token-negosphere-2026"
    }
