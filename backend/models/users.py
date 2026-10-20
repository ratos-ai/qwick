from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(index=True)
    password_hash: Mapped[str]
    email: Mapped[str] = mapped_column(index=True, unique=True)
