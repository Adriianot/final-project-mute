from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
from pydantic import BaseModel
import os

load_dotenv()

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError(" ERROR:")

client = MongoClient(MONGO_URI)
db = client["mute_ecommerce"]
clientes_collection = db["clientes"]

class ClerkUser(BaseModel):
    id: str
    email: str  
    nombre: str 

@router.post("/clerk")
async def sincronizar_usuario(user: ClerkUser):
    usuario = clientes_collection.find_one({"clerk_id": user.id})
    if not usuario:
        nuevo_usuario = {
            "clerk_id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "telefono": None,
            "direccion": None
        }
        clientes_collection.insert_one(nuevo_usuario)
        return {"message": "✅ Usuario creado en MongoDB"}
    
    return {"message": "🔹 Usuario ya existe en MongoDB"}
