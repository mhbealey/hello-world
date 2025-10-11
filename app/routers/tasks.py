from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.db import get_db, Base, engine
from app.models.entities import Task, TaskStatus
from app.services.tasks_service import list_tasks as svc_list_tasks

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Ensure tables exist on first import
Base.metadata.create_all(bind=engine)


@router.get("")
async def list_tasks(role: str | None = None, db: Session = Depends(get_db)):
    tasks = svc_list_tasks(db=db, role=role)
    return {"tasks": [
        {
            "id": t.id,
            "title": t.title,
            "status": t.status.value,
            "client_id": t.client_id,
            "assignee_id": t.assignee_id,
        } for t in tasks
    ]}
