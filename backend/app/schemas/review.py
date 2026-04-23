from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.book import BookSummary


class ReviewBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)

    @field_validator("content")
    @classmethod
    def strip_content(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Review content cannot be empty or whitespace")
        return v


class ReviewCreate(ReviewBase):
    book_id: int = Field(..., gt=0)


class ReviewUpdate(ReviewBase):
    book_id: int = Field(..., gt=0)


class ReviewResponse(BaseModel):
    id: int
    content: str
    book: BookSummary
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
