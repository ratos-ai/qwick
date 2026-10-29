from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrderBase(BaseModel):
    tour_id: str
    tour_title: str
    region: str
    date: datetime
    quantity: int
    total_price: float
    name: str
    contact: str


class OrderCreate(OrderBase):
    is_paid: bool = False


class OrderResponse(OrderBase):
    id: int
    is_paid: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
