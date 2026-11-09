from typing import TYPE_CHECKING

from sqlalchemy import text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .orders import Order


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    password_hash: Mapped[str]
    email: Mapped[str] = mapped_column(index=True, unique=True)
    is_superuser: Mapped[bool] = mapped_column(
        default=False, server_default=text("false")
    )

    orders: Mapped[list["Order"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )
