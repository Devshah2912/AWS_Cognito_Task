from Database import engine
from fastapi import FastAPI
from models import Base
from fastapi.middleware.cors import CORSMiddleware
import Operations

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(Operations.router)

