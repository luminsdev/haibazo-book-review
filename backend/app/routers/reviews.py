from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate
from app.schemas.pagination import PaginatedResponse
from app.services import review_service

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get(
    "",
    response_model=PaginatedResponse[ReviewResponse],
    summary="List reviews with pagination",
)
def list_reviews(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = review_service.list_reviews(db, page, page_size)
    return PaginatedResponse[ReviewResponse].create(
        items=items, total=total, page=page, page_size=page_size
    )


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a review",
)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    review = review_service.create_review(db, data)
    if review is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Book with id={data.book_id} not found",
        )
    return review


@router.get(
    "/{review_id}",
    response_model=ReviewResponse,
    summary="Get review by ID",
)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    review = review_service.get_review(db, review_id)
    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id={review_id} not found",
        )
    return review


@router.put(
    "/{review_id}",
    response_model=ReviewResponse,
    summary="Update a review",
)
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
):
    review, error = review_service.update_review(db, review_id, data)
    if error == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id={review_id} not found",
        )
    if error == "book_not_found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Book with id={data.book_id} not found",
        )
    return review


@router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a review",
)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    deleted = review_service.delete_review(db, review_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id={review_id} not found",
        )
    return None
