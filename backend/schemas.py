from datetime import datetime
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    role: str


class UserResponse(UserCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "pending"
    priority: str = "medium"
    assigned_to: int | None = None
    due_date: datetime | None = None


class TaskResponse(TaskCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    assigned_to: int | None = None
    due_date: datetime | None = None


class CommentCreate(BaseModel):
    user_id: int
    comment: str


class CommentResponse(BaseModel):
    id: int
    task_id: int
    user_id: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
