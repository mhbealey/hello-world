from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.db import get_db, Base, engine
from app.models.entities import Task, TaskStatus
from app.services.tasks_service import list_tasks as svc_list_tasks
from app.schemas import TaskCreate, TaskUpdate

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


@router.post("")
async def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(title=payload.title, description=payload.description, client_id=payload.client_id, assignee_id=payload.assignee_id, status=TaskStatus.open)
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"id": task.id, "title": task.title, "status": task.status.value}


@router.patch("/{task_id}")
async def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.status is not None:
        try:
            task.status = TaskStatus(payload.status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")
    if payload.client_id is not None:
        task.client_id = payload.client_id
    if payload.assignee_id is not None:
        task.assignee_id = payload.assignee_id
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"id": task.id, "title": task.title, "status": task.status.value}


@router.delete("/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"deleted": task_id}
