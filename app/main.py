from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routers.dashboard import router as dashboard_router
from app.routers.tasks import router as tasks_router
from app.routers.integrations import router as integrations_router
from app.routers.clients import router as clients_router
from app.routers.dev import router as dev_router
from app.models.db import Base, engine

app = FastAPI(title="Cyber Risk Delivery Agent")

# Static and templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Routers
app.include_router(dashboard_router)
app.include_router(tasks_router)
app.include_router(integrations_router)
app.include_router(clients_router)
app.include_router(dev_router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup():
    # Ensure DB tables exist (safe to call multiple times)
    Base.metadata.create_all(bind=engine)
