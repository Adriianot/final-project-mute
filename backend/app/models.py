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