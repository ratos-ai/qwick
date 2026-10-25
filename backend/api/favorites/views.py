from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth import get_current_user
from backend.core.database import get_db
from backend.models import User
from backend.schemas import UserFavoriteCreate, UserFavoriteResponse

from .crud import add_user_favorite, delete_user_favorite, get_user_favorites

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("/", response_model=list[UserFavoriteResponse])
async def get_user_favorites_view(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
) -> list[UserFavoriteResponse]:
    return await get_user_favorites(user=user, session=session)


@router.post("/", response_model=UserFavoriteResponse, status_code=201)
async def add_user_favorite_view(
    user: Annotated[User, Depends(get_current_user)],
    new_fav: UserFavoriteCreate,
    session: Annotated[AsyncSession, Depends(get_db)],
) -> UserFavoriteResponse:
    return await add_user_favorite(
        user=user, item_id=new_fav.item_id, item_type=new_fav.item_type, session=session
    )


@router.delete("/{item_id}", status_code=204)
async def delete_user_favorite_view(
    item_id: str,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    await delete_user_favorite(user=user, item_id=item_id, session=session)
