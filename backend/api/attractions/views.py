import uuid
from pathlib import Path
from typing import Annotated

import anyio
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth import get_current_admin
from backend.core.database import get_db
from backend.models import User
from backend.schemas import AttractionCreate, AttractionResponse

from .crud import create_attraction, get_attractions

router = APIRouter(prefix="/attractions", tags=["Attractions"])


@router.get("/", response_model=list[AttractionResponse])
async def get_attractions_view(
    session: Annotated[AsyncSession, Depends(get_db)], region: str | None = None
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


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: Annotated[UploadFile, File()],
    admin: Annotated[User, Depends(get_current_admin)],
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Файл должен быть картинкой")

    file_extension = file.filename.split(".")[-1] if file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    file_path = Path("uploads") / unique_filename

    file_path.parent.mkdir(parents=True, exist_ok=True)

    async with await anyio.open_file(file_path, "wb") as buffer:
        await buffer.write(await file.read())

    return {"image_url": f"/uploads/{unique_filename}"}
