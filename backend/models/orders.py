from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .users import User


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    tour_id: Mapped[str] = mapped_column(String, index=True)
    tour_title: Mapped[str] = mapped_column(String(255))
    region: Mapped[str] = mapped_column(String(100))

    date: Mapped[date] = mapped_column(Date)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2))

    name: Mapped[str] = mapped_column(String(100))
    contact: Mapped[str] = mapped_column(String(255))

    is_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="orders")
