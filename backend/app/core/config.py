from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "BackBencher AI Tutor"
    
    # Database
    DATABASE_URL: str = "sqlite:///./backbencher.db"
    
    # LLM
    LLAMA_SERVER_URL: str = "http://127.0.0.1:8081/v1/completions"
    LLM_MODEL: str = "phi-3"
    LLM_TIMEOUT: int = 60
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-it-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
