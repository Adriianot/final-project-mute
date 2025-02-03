from typing import Optional
from pydantic import BaseModel, EmailStr

class ClienteRegistro(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Producto(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    stock: int
    imagen: str
    categoria: Optional[str] = None
    marca: Optional[str] = None
    genero: Optional[str] = "unisex" 
