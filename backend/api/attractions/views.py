from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth import get_current_admin
from backend.core.database import get_db
from backend.models import User
from backend.schemas import AttractionCreate, AttractionResponse

from .crud import create_attraction, get_attractions

router = APIRouter(prefix="/attractions", tags=["Attractions"])


@router.get("/", response_model=list[AttractionResponse])
async def get_attractions_view(
    region: str | None, session: Annotated[AsyncSession, Depends(get_db)]
) -> list[AttractionResponse]:
    return await get_attractions(region=region, session=session)


@router.post(
    "/", response_model=AttractionResponse, status_code=status.HTTP_201_CREATED
)
async def create_attraction_view(
    attraction: AttractionCreate,
    session: Annotated[AsyncSession, Depends(get_db)],
    admin: Annotated[User, Depends(get_current_admin)],
) -> AttractionResponse:
    return await create_attraction(attraction=attraction, session=session)
