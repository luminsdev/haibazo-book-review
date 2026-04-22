from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Author, Book
from app.schemas.author import AuthorCreate, AuthorUpdate


def list_authors(
    db: Session,
    page: int,
    page_size: int,
) -> tuple[list[dict], int]:
    """
    Return items, total with book_count through LEFT JOI COUNT.
    items is list dict for Pydantic parse book_count.
    """
    total = db.scalar(select(func.count(Author.id))) or 0

    stmt = (
        select(
            Author,
            func.count(Book.id).label("book_count"),
        )
        .outerjoin(Book, Book.author_id == Author.id)
        .group_by(Author.id)
        .order_by(Author.id.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    rows = db.execute(stmt).all()
    items = [
        {
            "id": author.id,
            "name": author.name,
            "books_count": books_count,
            "created_at": author.created_at,
            "updated_at": author.updated_at,
        }
        for author, books_count in rows
    ]
    return items, total


def get_author(db: Session, author_id: int) -> dict | None:
    stmt = (
        select(
            Author,
            func.count(Book.id).label(
                "books_count",
            ),
        )
        .outerjoin(Book, Book.author_id == Author.id)
        .where(Author.id == author_id)
        .group_by(Author.id)
    )
    row = db.execute(stmt).first()
    if row is None:
        return None
    author, books_count = row
    return {
        "id": author.id,
        "name": author.name,
        "books_count": books_count,
        "created_at": author.created_at,
        "updated_at": author.updated_at,
    }


def create_author(db: Session, data: AuthorCreate) -> dict:
    author = Author(name=data.name)
    db.add(author)
    db.commit()
    db.refresh(author)
    return {
        "id": author.id,
        "name": author.name,
        "books_count": 0,
        "created_at": author.created_at,
        "updated_at": author.updated_at,
    }


def update_author(db: Session, author_id: int, data: AuthorUpdate) -> dict | None:
    author = db.get(Author, author_id)
    if author is None:
        return None
    author.name = data.name
    db.commit()
    db.refresh(author)
    return get_author(db, author_id)


def delete_author(db: Session, author_id: int) -> bool:
    author = db.get(Author, author_id)
    if author is None:
        return False
    db.delete(author)
    db.commit()
    return True
