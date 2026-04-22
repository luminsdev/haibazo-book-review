from math import ceil
from typing import Generic, TypeVar

from pydantic import BaseModel, Field
T = TypeVar("T")

class PaginationPrams(BaseModel): 
    """Query parameters for endpoint list."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)

    @property
    def offset(self) -> int: 
        return (self.page - 1) * self.page_size

class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int 
    page_size: int 
    total_pages: int 

    @classmethod
    def create(
        cls,
        items: list[T],
        total: int, 
        page: int, 
        page_size: int,
    ) -> "PaginatedResponse[T]": 
        total_pages = ceil(total / page_size) if total else 0 
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )