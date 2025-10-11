from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.db import get_db
from app.services.clients_service import list_clients as svc_list_clients, create_client as svc_create_client
from app.schemas import ClientCreate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("")
async def list_clients(db: Session = Depends(get_db)):
    clients = svc_list_clients(db)
    return {"clients": [{"id": c.id, "name": c.name, "segment": c.segment} for c in clients]}


@router.post("")
async def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    client = svc_create_client(db, name=payload.name, segment=payload.segment, external_id=payload.external_id)
    return {"id": client.id, "name": client.name, "segment": client.segment}
