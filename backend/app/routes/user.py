# routers/user_router.py
from fastapi import APIRouter, HTTPException, Header
from app.database import clientes_collection
from app.utils.jwt import decode_access_token

router = APIRouter()

@router.get("/user")
async def get_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    token = authorization.split(" ")[1]  # Extraer el token después de "Bearer"
    payload = decode_access_token(token)
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = clientes_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
