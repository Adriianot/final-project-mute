from typing import Optional, List
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

class CompraItem(BaseModel):
    id: str
    nombre: str
    precio: float
    talla: str
    cantidad: int
    imagen: Optional[str] = None

class Compra(BaseModel):
    cliente_id: Optional[str] = None
    cliente_email: EmailStr
    total: float
    productos: List[CompraItem]
    telefono: str
    direccion: str
    ubicacion: Optional[dict] = None
    metodo_pago: str