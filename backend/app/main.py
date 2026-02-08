import os
from contextlib import asynccontextmanager

from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import connect_to_mongo, close_mongo_connection
from .routers import employees, attendance, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="HRMS Lite API", version="1.0.0", lifespan=lifespan)

# CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:4173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:4173", "http://localhost:5173", "http://localhost:8000", "http://127.0.0.1:4173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {"message": "HRMS Lite API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
