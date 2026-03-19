import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./videodb.db"
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    UPLOAD_DIR: str = "uploads"
    FRAMES_DIR: str = "frames"
    AUDIO_DIR: str = "audio"
    MAX_UPLOAD_SIZE: int = 500 * 1024 * 1024  # 500MB
    
    # Model settings
    WHISPER_MODEL: str = "tiny"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

# Create settings instance
settings = Settings()

# Parse ALLOWED_ORIGINS separately
ALLOWED_ORIGINS = [
    origin.strip() 
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
]
