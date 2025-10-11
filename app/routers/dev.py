from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.db import get_db, Base, engine
from app.models.entities import Task, TaskStatus, Client, User, Role

router = APIRouter(prefix="/dev", tags=["dev"])

# Ensure tables exist
Base.metadata.create_all(bind=engine)


@router.post("/seed")
async def seed(db: Session = Depends(get_db)):
    # Idempotent-ish seed
    if not db.query(Client).first():
        acme = Client(name="Acme Capital", segment="PE")
        beta = Client(name="Beta Partners", segment="PE")
        gamma = Client(name="Gamma Portfolio Co.", segment="Portfolio")
        db.add_all([acme, beta, gamma])
        db.flush()

        analyst = User(email="analyst@example.com", display_name="Analyst A", role=Role.project_analyst)
        advisor = User(email="advisor@example.com", display_name="Advisor B", role=Role.advisor)
        db.add_all([analyst, advisor])
        db.flush()

        tasks = [
            Task(title="Onboard new PE client", status=TaskStatus.open, client_id=acme.id, assignee_id=analyst.id),
            Task(title="Schedule kickoff call", status=TaskStatus.in_progress, client_id=beta.id, assignee_id=analyst.id),
            Task(title="Create risk register", status=TaskStatus.blocked, client_id=gamma.id, assignee_id=advisor.id),
        ]
        db.add_all(tasks)
        db.commit()
    return {"status": "ok"}
