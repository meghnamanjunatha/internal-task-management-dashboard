from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Task

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

CURRENT_USER_ID = 1


@router.get("")
def get_dashboard(db: Session = Depends(get_db)):
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == "pending").count()
    in_progress_tasks = (
        db.query(Task).filter(Task.status == "in_progress").count()
    )
    completed_tasks = db.query(Task).filter(Task.status == "completed").count()
    overdue_tasks = (
        db.query(Task)
        .filter(
            Task.due_date < datetime.now(),
            Task.status != "completed",
        )
        .count()
    )
    assigned_to_me = (
        db.query(Task).filter(Task.assigned_to == CURRENT_USER_ID).count()
    )

    return {
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "assigned_to_me": assigned_to_me,
    }
