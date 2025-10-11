# Cyber Risk Delivery Agent (Scaffold)

A lightweight agent dashboard to orchestrate private cyber risk management delivery across roles (Project Analyst, Advisor, Senior Advisor, Operations, Practice Leader, Sales). Integrates with Salesforce, a custom cyber risk application, and Power BI.

## Quickstart

1. Python 3.11+
2. Create and activate venv

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

3. Run API/UI

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://localhost:8000/docs
- Dashboard: http://localhost:8000/dashboard?role=project_analyst

## Configuration

Set environment variables in `.env` for Salesforce, custom app, and Power BI if applicable. Connectors are no-ops unless configured.

## Structure

```
app/
  main.py
  config.py
  routers/
    dashboard.py
    tasks.py
    integrations.py
  models/
    db.py
    entities.py
  services/
    tasks_service.py
  connectors/
    salesforce.py
    custom_app.py
    power_bi.py
  templates/
    base.html
    dashboard.html
  static/
    styles.css
```

## Next Steps

- Add auth (OAuth/OIDC or SSO) and role gating
- Flesh out task CRUD and client pages
- Implement ingestion syncs from Salesforce/custom app
- Add Power BI embed flow if needed

## Deploy to Vercel

1. Create a new Vercel project and import this repo.
2. Set the project to use the Root Directory (repo root).
3. Ensure `vercel.json` exists (already included). It maps all routes to `api/index.py`.
4. Set Environment Variables as needed (optional):
   - `DATABASE_URL` (defaults to `sqlite:////tmp/app.db` on Vercel)
   - `SF_USERNAME`, `SF_PASSWORD`, `SF_SECURITY_TOKEN`, `SF_DOMAIN`
   - `CUSTOM_APP_BASE_URL`, `CUSTOM_APP_API_KEY`
   - `PBI_TENANT_ID`, `PBI_CLIENT_ID`, `PBI_CLIENT_SECRET`
5. Deploy. Visit `/` for the landing page; `/dashboard?role=project_analyst` for the dashboard; `/docs` for API docs.

Note: Vercel’s file system is ephemeral, so SQLite lives in `/tmp` and resets on each cold start. For persistence, use a hosted DB and set `DATABASE_URL` accordingly.
