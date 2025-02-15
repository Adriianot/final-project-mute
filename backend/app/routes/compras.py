from fastapi import APIRouter, HTTPException, Query
from app.database import compras_collection, clientes_collection
from app.models import Compra

router = APIRouter()

@router.post("/comprar")
async def registrar_compra(compra: Compra):
    try:
        # Buscar el ID del cliente basado en el email
        cliente = clientes_collection.find_one({"email": compra.cliente_email}, {"_id": 1})
        
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

        # Convertir la compra a un diccionario
        compra_dict = compra.dict()

        # ✅ Agregar el ID del cliente sin que el frontend lo envíe
        compra_dict["cliente_id"] = str(cliente["_id"])

        # 🔥 Remover cualquier dato de tarjeta si llega al backend
        if "creditCard" in compra_dict:
            del compra_dict["creditCard"]

        # Guardar la compra en MongoDB
        compras_collection.insert_one(compra_dict)

        return {"message": "Compra registrada con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/purchase")
async def obtener_compras(email: str = Query(..., description="Email del cliente")):
    try:
        # ✅ Filtrar compras solo del usuario que hace la solicitud
        compras = list(compras_collection.find({"cliente_email": email}, {"_id": 1, "total": 1, "productos": 1}))

        if not compras:
            raise HTTPException(status_code=404, detail="No se encontraron compras para este usuario")

        # ✅ Convertir ObjectId a string antes de devolver
        for compra in compras:
            compra["_id"] = str(compra["_id"])

        return compras
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))