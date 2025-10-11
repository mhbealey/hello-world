from fastapi import APIRouter
from app.connectors.salesforce import SalesforceConnector
from app.connectors.custom_app import CustomAppConnector
from app.connectors.power_bi import PowerBIConnector
from app.config import settings

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("")
async def integrations_status():
    sf = SalesforceConnector()
    custom = CustomAppConnector()
    pbi = PowerBIConnector(settings.pbi_tenant_id, settings.pbi_client_id, settings.pbi_client_secret)

    return {
        "salesforce": sf.is_configured(),
        "custom_app": custom.is_configured(),
        "power_bi": pbi.is_configured(),
    }
