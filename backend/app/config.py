import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/videodb")
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    UPLOAD_DIR: str = "uploads"
    FRAMES_DIR: str = "frames"
    AUDIO_DIR: str = "audio"
    MAX_UPLOAD_SIZE: int = 500 * 1024 * 1024  # 500MB
    
    # Model settings
    WHISPER_MODEL: str = "base"  # tiny, base, small, medium, large
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    class Config:
        env_file = ".env"

settings = Settings()
