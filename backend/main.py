from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from users import router as users_router
from tasks import router as tasks_router
from dashboard import router as dashboard_router
from comments import router as comments_router
from external import router as external_router

from database import Base, engine
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(tasks_router)
app.include_router(dashboard_router)
app.include_router(comments_router)
app.include_router(external_router)


@app.get("/")
def root():
    return {"message": "Task Management API is running"}
