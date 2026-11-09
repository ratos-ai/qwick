from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import Order, User
from backend.schemas import OrderCreate


async def create_order(user_id: int, session: AsyncSession, data: OrderCreate) -> Order:
    order = Order(**data.model_dump(), user_id=user_id)
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order


async def get_user_orders(session: AsyncSession, user_id: int) -> list[Order]:
    stmt = (
        select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
    )
    result = await session.scalars(stmt)
    return list(result.all())


async def get_all_orders(session: AsyncSession) -> list[Order]:
    stmt = select(Order).order_by(Order.created_at.desc())
    result = await session.scalars(stmt)
    return list(result.all())


async def get_order_by_id(session: AsyncSession, order_id: int) -> Order | None:
    return await session.get(Order, order_id)


async def delete_order(session: AsyncSession, order_id: int, user: User):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != user.id:
        raise HTTPException(
            status_code=403, detail="You can't delete someone else's order"
        )

    await session.delete(order)
    await session.commit()
