import os

# Default SQLite location on Vercel is ephemeral /tmp
if "DATABASE_URL" not in os.environ:
    if os.getenv("VERCEL"):
        os.environ["DATABASE_URL"] = "sqlite:////tmp/app.db"
    else:
        os.environ["DATABASE_URL"] = "sqlite:///./app.db"

# Reuse FastAPI app
from app.main import app  # noqa: E402
