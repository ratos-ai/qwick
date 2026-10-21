from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

from .config import settings


def encode_jwt(
    payload: dict,
    expire_minutes: int | None = None,
) -> str:
    to_encode = payload.copy()

    minutes = expire_minutes or settings.auth.ACCESS_TOKEN_EXPIRE_MINUTES
    expire = datetime.now(UTC) + timedelta(minutes=minutes)

    to_encode.update({"exp": expire})

    token = jwt.encode(
        payload=to_encode,
        key=settings.auth.get_private_key(),
        algorithm=settings.auth.ALGORITHM,
    )
    return token


def decode_jwt(token: str) -> dict:
    return jwt.decode(
        jwt=token,
        key=settings.auth.get_public_key(),
        algorithms=[settings.auth.ALGORITHM],
    )


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()


def validate_password(hashed_password: str, password: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password.encode())
