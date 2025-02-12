from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["mute_ecommerce"]

# Colecciones
clientes_collection = db["clientes"]
productos_collection = db["productos"]
compras_collection = db["compras"]
clientes_collection = db["clientes"]