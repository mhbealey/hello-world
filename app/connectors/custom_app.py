from __future__ import annotations
from typing import Any, Dict, List
import httpx

from app.config import settings


class CustomAppConnector:
    def __init__(self) -> None:
        self.base_url = settings.custom_app_base_url
        self.api_key = settings.custom_app_api_key

    def is_configured(self) -> bool:
        return bool(self.base_url and self.api_key)

    async def get_client_risks(self, client_external_id: str) -> List[Dict[str, Any]]:
        if not self.is_configured():
            return []
        headers = {"Authorization": f"Bearer {self.api_key}"}
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(f"{self.base_url}/clients/{client_external_id}/risks", headers=headers)
            resp.raise_for_status()
            return resp.json()
