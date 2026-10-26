from typing import Annotated

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models import Attraction
from backend.schemas import AttractionCreate


async def create_attraction(
    attraction: AttractionCreate, session: Annotated[AsyncSession, Depends(get_db)]
) -> Attraction:
    new_attraction = Attraction(**attraction.model_dump())
    session.add(new_attraction)
    await session.commit()
    await session.refresh(new_attraction)
    return new_attraction


async def get_attractions(
    session: Annotated[AsyncSession, Depends(get_db)], region: str | None = None
) -> list[Attraction]:
    stmt = select(Attraction)

    if region and region != "all":
        stmt = stmt.where(Attraction.region == region)

    result = await session.scalars(stmt)
    return list(result.all())
