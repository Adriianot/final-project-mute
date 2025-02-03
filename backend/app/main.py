from fastapi import FastAPI
from app.routes import auth, login, user, clerk, product

app = FastAPI()

# Registrar las rutas
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(login.router, prefix="/auth", tags=["Login"])
app.include_router(user.router, prefix="/auth", tags=["Auth"])
app.include_router(clerk.router, prefix="/auth", tags=["Auth"])
app.include_router(product.router, prefix="/auth", tags=["Products"])