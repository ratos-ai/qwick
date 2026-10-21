import uuid
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core import security
from backend.core.config import settings
from backend.core.database import get_db
from backend.models import RefreshToken, User
from backend.schemas import Token, UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authorization"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(
    user_in: UserCreate, session: Annotated[AsyncSession, Depends(get_db)]
):
    user_exists = await session.scalar(
        select(User).where(
            (User.email == user_in.email) | (User.username == user_in.username)
        )
    )

    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address or username already exists",
        )

    hashed_password = security.hash_password(user_in.password)
    new_user = User(
        username=user_in.username, email=user_in.email, password_hash=hashed_password
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
async def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    user = await session.scalar(select(User).where(User.username == form_data.username))
    if not user or not security.validate_password(
        user.password_hash, form_data.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.encode_jwt({"sub": str(user.id)})
    refresh_token_str = str(uuid.uuid4())
    expires_at = datetime.now(UTC) + timedelta(
        days=settings.auth.REFRESH_TOKEN_EXPIRE_DAYS
    )

    db_refresh_token = RefreshToken(
        refresh_token=refresh_token_str, user_id=user.id, exp=expires_at
    )
    session.add(db_refresh_token)
    await session.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_str,
        httponly=True,
        secure=settings.auth.REFRESH_TOKEN_COOKIE_SECURE,
        samesite="lax",
        max_age=settings.auth.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh", response_model=Token)
async def refresh_tokens(
    response: Response,
    session: Annotated[AsyncSession, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    db_token = await session.scalar(
        select(RefreshToken).where(RefreshToken.refresh_token == refresh_token)
    )

    if not db_token or db_token.exp < datetime.now(UTC):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access_token = security.encode_jwt({"sub": str(db_token.user_id)})

    refresh_token_str = str(uuid.uuid4())
    expires_at = datetime.now(UTC) + timedelta(
        days=settings.auth.REFRESH_TOKEN_EXPIRE_DAYS
    )
    new_refresh_token = RefreshToken(
        refresh_token=refresh_token_str, user_id=db_token.user_id, exp=expires_at
    )

    await session.execute(
        delete(RefreshToken).where(RefreshToken.refresh_token == refresh_token)
    )
    session.add(new_refresh_token)
    await session.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_str,
        httponly=True,
        secure=settings.auth.REFRESH_TOKEN_COOKIE_SECURE,
        samesite="lax",
        max_age=settings.auth.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(
    response: Response,
    session: Annotated[AsyncSession, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if refresh_token:
        db_token = await session.scalar(
            select(RefreshToken).where(RefreshToken.refresh_token == refresh_token)
        )
        if db_token:
            await session.delete(db_token)
            await session.commit()

    response.delete_cookie(key="refresh_token")
    return {"detail": "Успешный выход из системы"}
