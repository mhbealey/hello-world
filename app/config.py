from pydantic import BaseSettings, Field
from typing import Optional


class Settings(BaseSettings):
    # App
    app_name: str = "Cyber Risk Delivery Agent"
    environment: str = Field("local", env="ENVIRONMENT")

    # Database
    database_url: str = Field("sqlite:///./app.db", env="DATABASE_URL")

    # Salesforce
    sf_username: Optional[str] = Field(None, env="SF_USERNAME")
    sf_password: Optional[str] = Field(None, env="SF_PASSWORD")
    sf_security_token: Optional[str] = Field(None, env="SF_SECURITY_TOKEN")
    sf_domain: str = Field("login", env="SF_DOMAIN")

    # Custom App
    custom_app_base_url: Optional[str] = Field(None, env="CUSTOM_APP_BASE_URL")
    custom_app_api_key: Optional[str] = Field(None, env="CUSTOM_APP_API_KEY")

    # Power BI / Azure AD
    pbi_tenant_id: Optional[str] = Field(None, env="PBI_TENANT_ID")
    pbi_client_id: Optional[str] = Field(None, env="PBI_CLIENT_ID")
    pbi_client_secret: Optional[str] = Field(None, env="PBI_CLIENT_SECRET")

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
