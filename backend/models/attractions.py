from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Attraction(Base):
    __tablename__ = "attractions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    region: Mapped[str] = mapped_column(String(50), index=True)
    category: Mapped[str] = mapped_column(String(100))
    emoji: Mapped[str] = mapped_column(String(10), default="📍")
    short_desc: Mapped[str] = mapped_column(Text)
    meta: Mapped[str] = mapped_column(String(255))

    facts: Mapped[list[dict]] = mapped_column(JSONB, default=list)
    sections: Mapped[list[dict]] = mapped_column(JSONB, default=list)
