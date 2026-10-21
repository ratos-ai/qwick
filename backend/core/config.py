from pathlib import Path

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent.parent


class Auth(BaseModel):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 90
    REFRESH_TOKEN_COOKIE_SECURE: bool = True
    ALGORITHM: str = "RS256"
    PRIVATE_KEY_PATH: str = "certs/private-key.pem"
    PUBLIC_KEY_PATH: str = "certs/public-key.pem"

    def get_private_key(self) -> str:
        path = BASE_DIR / self.PRIVATE_KEY_PATH
        if not path.exists():
            raise FileNotFoundError(f"Private key not found: {path}")
        return path.read_text()

    def get_public_key(self) -> str:
        path = BASE_DIR / self.PUBLIC_KEY_PATH
        if not path.exists():
            raise FileNotFoundError(f"Public key not found: {path}")
        return path.read_text()


class Settings(BaseSettings):
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000

    DB_URL: str
    DB_ECHO: bool = False

    auth: Auth = Auth()

    model_config = SettingsConfigDict(
        env_nested_delimiter="__", env_file=".env", extra="ignore"
    )


settings = Settings()
