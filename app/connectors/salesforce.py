from __future__ import annotations
from typing import Any, Dict, List, Optional

try:
    from simple_salesforce import Salesforce
except Exception:  # pragma: no cover - optional dependency
    Salesforce = None  # type: ignore

from app.config import settings


class SalesforceConnector:
    def __init__(self) -> None:
        self.client = None
        if Salesforce and settings.sf_username and settings.sf_password and settings.sf_security_token:
            self.client = Salesforce(
                username=settings.sf_username,
                password=settings.sf_password,
                security_token=settings.sf_security_token,
                domain=settings.sf_domain,
            )

    def is_configured(self) -> bool:
        return self.client is not None

    def get_accounts(self, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.client:
            return []
        soql = f"SELECT Id, Name, Industry, Type FROM Account LIMIT {limit}"
        result = self.client.query(soql)
        return result.get("records", [])
