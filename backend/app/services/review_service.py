from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models import Book, Review
from app.schemas.review import ReviewCreate, ReviewUpdate


def list_reviews(
    db: Session,
    page: int,
    page_size: int,
) -> tuple[list[Review], int]:
    total = db.scalar(select(func.count(Review.id))) or 0
    stmt = (
        select(Review)
        .options(joinedload(Review.book).joinedload(Book.author))
        .order_by(Review.id.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    reviews = db.scalars(stmt).all()
    return list(reviews), total


def get_review(db: Session, review_id: int) -> Review | None:
    stmt = (
        select(Review)
        .options(joinedload(Review.book).joinedload(Book.author))
        .where(Review.id == review_id)
    )
    return db.scalars(stmt).first()


def create_review(db: Session, data: ReviewCreate) -> Review | None:
    book = db.get(Book, data.book_id)
    if book is None:
        return None
    review = Review(book_id=data.book_id, content=data.content)
    db.add(review)
    db.commit()
    db.refresh(review)
    return get_review(db, review.id)


def update_review(
    db: Session,
    review_id: int,
    data: ReviewUpdate,
) -> tuple[Review | None, str | None]:
    review = db.get(Review, review_id)
    if review is None:
        return None, "not_found"

    book = db.get(Book, data.book_id)
    if book is None:
        return None, "book_not_found"

    review.content = data.content
    review.book_id = data.book_id
    db.commit()
    return get_review(db, review_id), None


def delete_review(db: Session, review_id: int) -> bool:
    review = db.get(Review, review_id)
    if review is None:
        return False
    db.delete(review)
    db.commit()
    return True
