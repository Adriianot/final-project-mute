from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Configuración de Router
router = APIRouter()

# Cargar variables de entorno
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Conectar a MongoDB
client = MongoClient(MONGO_URI)
db = client["mute_ecommerce"]
productos_collection = db["productos"]

@router.get("/productos")
async def obtener_productos():
    try:
        productos = list(productos_collection.find({}, {"_id": 0}))  # Excluir _id de la respuesta
        if not productos:
            raise HTTPException(status_code=404, detail="No hay productos disponibles")
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos: {str(e)}")