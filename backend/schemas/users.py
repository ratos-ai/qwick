import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str = Field(
        ..., min_length=8, max_length=100, description="Пароль от 8 до 100 символов"
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Username может содержать только латинские буквы, цифры и символ подчеркивания"
            )
        if len(v) < 3:
            raise ValueError("Username должен быть не менее 3 символов")
        return v


class UserResponse(UserBase):
    id: int
    is_superuser: bool
    model_config = ConfigDict(from_attributes=True)
