from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import Favorite, User


async def get_user_favorites(user: User, session: AsyncSession) -> list[Favorite]:
    stmt = select(Favorite).where(Favorite.user_id == user.id)
    result = await session.scalars(stmt)

    return list(result.all())


async def add_user_favorite(
    user: User, item_id: str, item_type: str, session: AsyncSession
) -> Favorite:
    new_fav = Favorite(user_id=user.id, item_id=item_id, item_type=item_type)
    session.add(new_fav)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Already in favorites"
        )

    return new_fav


async def delete_user_favorite(user: User, item_id: str, session: AsyncSession):
    stmt = select(Favorite).where(
        Favorite.user_id == user.id, Favorite.item_id == item_id
    )
    fav = await session.scalar(stmt)

    if fav:
        await session.delete(fav)
        await session.commit()
