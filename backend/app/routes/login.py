from fastapi import APIRouter, HTTPException
from app.models import LoginRequest
from app.utils.hashing import verify_password
from app.utils.jwt import create_access_token
from app.database import clientes_collection

router = APIRouter()

# Modelo para validar los datos del login
# class LoginRequest(BaseModel):
#     email: EmailStr
#     password: str

@router.post("/login")
async def login(login_data: LoginRequest): 

    user = clientes_collection.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

   
    token = create_access_token({"email": login_data.email})

    return {"message": "Login exitoso", "token": token}

