from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
from pydantic import BaseModel
import os

# Configuración
router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["mute_ecommerce"]
clientes_collection = db["clientes"]

class ClerkUser(BaseModel):
    id: str
    email: str
    name: str

@router.post("/auth/clerk")
async def save_clerk_user(user: ClerkUser):
    try:
        existing_user = clientes_collection.find_one({"id": user.id})
        if not existing_user:
            new_user = {"id": user.id, "email": user.email, "name": user.name}
            clientes_collection.insert_one(new_user)
            return {"message": "Usuario registrado exitosamente"}
        else:
            return {"message": "Usuario ya existe"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar usuario: {str(e)}")
