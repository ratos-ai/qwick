from pydantic import BaseModel, ConfigDict


class AttractionBase(BaseModel):
    title: str
    region: str
    category: str
    emoji: str = "📍"
    short_desc: str
    meta: str
    image_url: str | None = None
    item_type: str = "attraction"
    price: float | None = None
    facts: list[dict] = []
    sections: list[dict] = []


class AttractionCreate(AttractionBase):
    pass


class AttractionResponse(AttractionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
