from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING: 
    from app.models.author import Author 
    from app.models.review import Review

class Book(Base, TimestampMixin):
    __tablename__ ="books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(
        ForeignKey("authors.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    author: Mapped["Author"] = relationship(back_populates="books")
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="book",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Book id={self.id} title={self.title!r}>"