from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.auth import router as auth_router
from backend.routes.generate import router as generate_router
from backend.database import init_db

app = FastAPI(title="Requirements Spec Copilot API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(generate_router, prefix="/generate", tags=["generate"])

@app.get("/")
async def root():
    return {"message": "Requirements Spec Copilot API"}

