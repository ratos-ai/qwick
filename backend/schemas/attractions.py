from pydantic import BaseModel, ConfigDict


class AttractionBase(BaseModel):
    title: str
    region: str
    category: str
    emoji: str = "📍"
    short_desc: str
    meta: str
    facts: list[dict] = []
    sections: list[dict] = []


class AttractionCreate(AttractionBase):
    pass


class AttractionResponse(AttractionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
