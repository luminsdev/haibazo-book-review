from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import BookCreate, BookResponse, BookSummary, BookUpdate
from app.schemas.pagination import PaginatedResponse
from app.services import book_service

router = APIRouter(prefix="/books", tags=["Books"])


@router.get(
    "/options",
    response_model=list[BookSummary],
    summary="List all books for dropdown(no pagination)",
)
def list_book_options(db: Session = Depends(get_db)):
    return book_service.list_book_options(db)


@router.get(
    "",
    response_model=PaginatedResponse[BookResponse],
    summary="List books with pagination",
)
def list_books(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = book_service.list_books(db, page, page_size)
    return PaginatedResponse[BookResponse].create(
        items=items, total=total, page=page, page_size=page_size
    )


@router.post(
    "",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a book",
)
def create_book(data: BookCreate, db: Session = Depends(get_db)):
    book = book_service.create_book(db, data)
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Author with id={data.author_id} not found",
        )
    return book


@router.get(
    "/{book_id}",
    response_model=BookResponse,
    summary="Get Book by ID",
)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = book_service.get_book(db, book_id)
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id={book_id} not found",
        )
    return book


@router.put("/{book_id}", response_model=BookResponse, summary="Update a book")
def update_book(book_id: int, data: BookUpdate, db: Session = Depends(get_db)):
    book, error = book_service.update_book(db, book_id, data)
    if error == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id={book_id} not found",
        )
    if error == "author_not_found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Author with id={data.author_id} not found",
        )
    return book


@router.delete(
    "/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a book (cascade to reviews)",
)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted = book_service.delete_book(db, book_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id={book_id} not found",
        )
    return None
