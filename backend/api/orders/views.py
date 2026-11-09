from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth.deps import get_current_admin, get_current_user
from backend.core.database import get_db
from backend.models import User
from backend.schemas import OrderCreate, OrderResponse

from .crud import (
    create_order,
    delete_order,
    get_all_orders,
    get_order_by_id,
    get_user_orders,
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order_view(
    data: OrderCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    return await create_order(session=session, user_id=user.id, data=data)


@router.get("/", response_model=list[OrderResponse])
async def get_my_orders_view(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    return await get_user_orders(session=session, user_id=user.id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_order_view(
    order_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    await delete_order(order_id=order_id, session=session, user=user)


# ADMIN ROUTES
@router.get("/admin/all", response_model=list[OrderResponse])
async def get_all_orders_view(
    admin: Annotated[User, Depends(get_current_admin)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    return await get_all_orders(session=session)


@router.delete("/admin/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_any_order_view(
    order_id: int,
    admin: Annotated[User, Depends(get_current_admin)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    await session.delete(order)
    await session.commit()
