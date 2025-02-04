from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Verificar si la clave de API está configurada
if not GEMINI_API_KEY:
    raise ValueError("La clave de API de Gemini no está configurada en el archivo .env")

# Configurar Google Generative AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")

# Crear router de FastAPI
router = APIRouter()

# Modelo de datos
class ChatRequest(BaseModel):
    message: str

# Prompt personalizado
SYSTEM_PROMPT = """Eres un asistente virtual para la tienda de moda MUTE. 
Tu objetivo es ayudar a los clientes con información sobre ropa, accesorios, tendencias de moda y compras en línea. 
Solo responderás preguntas relacionadas con estos temas y no discutirás sobre otros asuntos. 
Si alguien pregunta sobre otro tema, responde educadamente que solo puedes ayudar con moda y productos de MUTE."""

# Ruta del chatbot
@router.post("/chatbot")
async def chatbot_response(chat_request: ChatRequest):
    try:
        # Enviar mensaje con el contexto predefinido
        response = model.generate_content(
            SYSTEM_PROMPT + "\n\nCliente: " + chat_request.message
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
