from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models import Author, Book
from app.schemas.book import BookCreate, BookUpdate


def list_books(
    db: Session,
    page: int,
    page_size: int,
) -> tuple[list[Book], int]:
    total = db.scalar(select(func.count(Book.id))) or 0
    stmt = (
        select(Book)
        .options(joinedload(Book.author))
        .order_by(Book.id.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    books = db.scalars(stmt).all()
    return list(books), total


def list_book_options(db: Session) -> list[Book]:
    stmt = select(Book).options(joinedload(Book.author)).order_by(Book.title.asc())
    return list(db.scalars(stmt).all())


def get_book(db: Session, book_id: int) -> Book | None:
    stmt = select(Book).options(joinedload(Book.author)).where(Book.id == book_id)
    return db.scalars(stmt).first()


def create_book(db: Session, data: BookCreate) -> Book | None:
    author = db.get(Author, data.author_id)
    if author is None:
        return None
    book = Book(title=data.title, author_id=data.author_id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return get_book(db, book.id)


def update_book(
    db: Session,
    book_id: int,
    data: BookUpdate,
) -> tuple[Book | None, str | None]:
    """Return (book, error_message). error_message = None if return success."""
    book = db.get(Book, book_id)
    if book is None:
        return None, "not_found"

    author = db.get(Author, data.author_id)
    if author is None:
        return None, "author_not_found"

    book.title = data.title
    book.author_id = data.author_id
    db.commit()
    return get_book(db, book_id), None


def delete_book(db: Session, book_id: int) -> bool:
    book = db.get(Book, book_id)
    if book is None:
        return False
    db.delete(book)
    db.commit()
    return True
