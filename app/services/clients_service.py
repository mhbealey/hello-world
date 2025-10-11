from __future__ import annotations
from typing import List
from sqlalchemy.orm import Session

from app.models.entities import Client


def list_clients(db: Session) -> List[Client]:
    return db.query(Client).order_by(Client.name.asc()).all()


def create_client(db: Session, name: str, segment: str | None = None, external_id: str | None = None) -> Client:
    client = Client(name=name, segment=segment, external_id=external_id)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client
