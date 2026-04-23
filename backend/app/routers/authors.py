from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Author
from app.schemas.author import AuthorCreate, AuthorResponse, AuthorUpdate, AuthorSummary
from app.schemas.pagination import PaginatedResponse
from app.services import author_service

router = APIRouter(prefix="/authors", tags=["Authors"])


@router.get(
    "",
    response_model=PaginatedResponse[AuthorResponse],
    summary="List authors with pagination",
)
def list_authors(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = author_service.list_authors(db, page, page_size)
    return PaginatedResponse[AuthorResponse].create(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/options",
    response_model=list[AuthorSummary],
    summary="ist all authors for dropdown (no pagination)",
)
def list_author_options(db: Session = Depends(get_db)):
    stmt = select(Author).order_by(Author.name.asc())
    return list(db.scalars(stmt).all())


@router.post(
    "",
    response_model=AuthorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an author",
)
def create_author(
    data: AuthorCreate,
    db: Session = Depends(get_db),
):
    return author_service.create_author(db, data)


@router.get("/{author_id}", response_model=AuthorResponse, summary="Get author by ID")
def get_author(author_id: int, db: Session = Depends(get_db)):
    author = author_service.get_author(db, author_id)
    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author with id={author_id} not found",
        )
    return author


@router.put("/{author_id}", response_model=AuthorResponse, summary="Update an author")
def update_author(author_id: int, data: AuthorUpdate, db: Session = Depends(get_db)):
    author = author_service.update_author(db, author_id, data)
    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author with id={author_id} not found",
        )
    return author


@router.delete(
    "/{author_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an author (cascade to books and reviews)",
)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    deleted = author_service.delete_author(db, author_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author with id={author_id} not found",
        )
    return None
