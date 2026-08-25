from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Comment, Task
from schemas import CommentCreate, CommentResponse

router = APIRouter(prefix="/api/tasks", tags=["comments"])


@router.get("/{task_id}/comments", response_model=list[CommentResponse])
def get_comments(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return db.query(Comment).filter(Comment.task_id == task_id).all()


@router.post(
    "/{task_id}/comments",
    response_model=CommentResponse,
    status_code=201,
)
def create_comment(
    task_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_comment = Comment(task_id=task_id, **comment.model_dump())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    return db_comment
