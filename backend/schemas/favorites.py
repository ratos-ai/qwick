from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserFavoriteCreate(BaseModel):
    item_id: str
    item_type: str


class UserFavoriteResponse(BaseModel):
    id: int
    item_id: str
    item_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
