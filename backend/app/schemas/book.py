from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.author import AuthorSummary


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)

    @field_validator("title")
    @classmethod
    def strip_title(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Title cannot be empty or whitespace")
        return v


class BookCreate(BookBase):
    author_id: int = Field(..., gt=0)


class BookUpdate(BookBase):
    author_id: int = Field(..., gt=0)


class BookResponse(BaseModel):
    id: int
    title: str
    author: AuthorSummary
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookSummary(BaseModel):
    """Nested in Review response + use for dropdown"""

    id: int
    title: str
    author: AuthorSummary

    model_config = ConfigDict(from_attributes=True)
