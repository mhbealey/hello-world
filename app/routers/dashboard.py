from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

SUPPORTED_ROLES = [
    "project_analyst",
    "advisor",
    "senior_advisor",
    "operations",
    "practice_leader",
    "sales",
]


@router.get("/")
async def root(request: Request):
    templates = Jinja2Templates(directory="app/templates")
    return templates.TemplateResponse("landing.html", {"request": request})


@router.get("/dashboard")
async def dashboard(request: Request, role: str = "project_analyst"):
    if role not in SUPPORTED_ROLES:
        return JSONResponse(status_code=400, content={"error": "invalid role"})
    # Render HTML template
    templates = Jinja2Templates(directory="app/templates")
    return templates.TemplateResponse("dashboard.html", {"request": request, "role": role})


@router.post("/sync")
async def trigger_sync(background_tasks: BackgroundTasks):
    # Placeholder background sync job
    def do_sync():
        # connect to external systems and ingest data
        return

    background_tasks.add_task(do_sync)
    return {"status": "queued"}
