from fastapi import FastAPI
from users import router as users_router
from tasks import router as tasks_router
from dashboard import router as dashboard_router
from comments import router as comments_router
from external import router as external_router

from database import Base, engine
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

app.include_router(users_router)
app.include_router(tasks_router)
app.include_router(dashboard_router)
app.include_router(comments_router)
app.include_router(external_router)


@app.get("/")
def root():
    return {"message": "Task Management API is running"}
