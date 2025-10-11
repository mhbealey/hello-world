from __future__ import annotations
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.entities import Task, TaskStatus


def list_tasks(db: Session, role: Optional[str] = None) -> List[Task]:
    query = db.query(Task)
    # role-based filtering could be added here later
    return query.order_by(Task.created_at.desc().nullslast()).all()
