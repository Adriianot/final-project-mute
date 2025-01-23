from fastapi import APIRouter, HTTPException
from app.models import ClienteRegistro
from app.database import clientes_collection
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/register")
async def register(cliente: ClienteRegistro):
    
    if clientes_collection.find_one({"email": cliente.email}):
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    hashed_password = hash_password(cliente.password)

    nuevo_cliente = {
        "nombre": cliente.nombre,
        "email": cliente.email,
        "password": hashed_password,
        "telefono": cliente.telefono,
        "direccion": cliente.direccion,
    }

    clientes_collection.insert_one(nuevo_cliente)

    token = create_access_token({"email": cliente.email})

    return {"message": "Registro exitoso", "token": token}
