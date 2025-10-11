from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routers.dashboard import router as dashboard_router
from app.routers.tasks import router as tasks_router
from app.routers.integrations import router as integrations_router

app = FastAPI(title="Cyber Risk Delivery Agent")

# Static and templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Routers
app.include_router(dashboard_router)
app.include_router(tasks_router)
app.include_router(integrations_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
