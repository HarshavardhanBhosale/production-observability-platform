import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "production-backend"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    DATABASE_URL: str
    REDIS_URL: str
    
  
    OTEL_EXPORTER_OTLP_ENDPOINT: str = "http://otel-collector:4317"

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

