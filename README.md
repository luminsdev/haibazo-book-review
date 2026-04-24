# Haibazo Book Review

A full-stack book review management application built for the **Haibazo Intern Software Engineer** entrance test (Round 2). The app provides a clean editorial interface for managing authors, books, and reviews with full CRUD operations.

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite |
| **Backend** | Python, FastAPI |
| **Database** | PostgreSQL |
| **ORM / Migrations** | SQLAlchemy 2, Alembic |

### Frontend Libraries

- **Styling** — Tailwind CSS v4, shadcn/ui (Radix UI primitives)
- **Data fetching** — TanStack React Query, Axios
- **Forms & Validation** — React Hook Form, Zod
- **Routing** — React Router v7
- **Icons** — Lucide React
- **Notifications** — Sonner

### Backend Libraries

- **Validation** — Pydantic v2
- **Database driver** — Psycopg 3
- **Server** — Uvicorn

## Features

- **Authors** — Create, list (paginated), update (via modal), and delete with cascade confirmation
- **Books** — Create with author selection (dropdown), list, update, and delete
- **Reviews** — Create with book selection, list with blockquote-style display, update, and delete
- **Form validation** — Client-side (Zod) and server-side (Pydantic) validation on all forms
- **Pagination** — Server-side pagination across all list views
- **Responsive feedback** — Loading skeletons, toast notifications, and optimistic UI via React Query cache invalidation
- **Seed data** — Built-in seed script with sample authors, books, and reviews

## Project Structure

```
haibazo-book-review/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models (Author, Book, Review)
│   │   ├── routers/         # FastAPI route handlers
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic layer
│   │   ├── config.py        # App settings (env-based)
│   │   ├── database.py      # DB engine & session factory
│   │   └── main.py          # FastAPI app entrypoint
│   ├── alembic/             # Database migrations
│   ├── scripts/
│   │   └── seed.py          # Sample data seeder
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # MainLayout, Sidebar, PageHeader, Pagination
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── features/
│   │   │   ├── authors/     # AuthorForm, AuthorsTable, dialogs, API hooks, schema
│   │   │   ├── books/       # BookForm, BooksTable, dialogs, API hooks, schema
│   │   │   └── reviews/     # ReviewForm, ReviewsTable, dialogs, API hooks, schema
│   │   ├── lib/             # Axios instance, types, query keys, utilities
│   │   ├── pages/           # Route-level page components
│   │   ├── App.tsx          # Route definitions
│   │   └── main.tsx         # React entrypoint
│   ├── package.json
│   └── .env.example
│
└── .gitignore
```

## Getting Started

### Prerequisites

- **Python** 3.12+
- **Node.js** 20+ and **pnpm**
- **PostgreSQL** 15+

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE haibazo_book_review;
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run database migrations
alembic upgrade head

# (Optional) Seed sample data
python -m scripts.seed

# Start the API server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive docs at `/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if your API runs on a different port

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

## API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/authors` | List authors (paginated) |
| `GET` | `/api/authors/options` | All authors for dropdown |
| `POST` | `/api/authors` | Create an author |
| `GET` | `/api/authors/:id` | Get author by ID |
| `PUT` | `/api/authors/:id` | Update an author |
| `DELETE` | `/api/authors/:id` | Delete an author (cascades to books & reviews) |
| `GET` | `/api/books` | List books (paginated) |
| `GET` | `/api/books/options` | All books for dropdown |
| `POST` | `/api/books` | Create a book |
| `GET` | `/api/books/:id` | Get book by ID |
| `PUT` | `/api/books/:id` | Update a book |
| `DELETE` | `/api/books/:id` | Delete a book (cascades to reviews) |
| `GET` | `/api/reviews` | List reviews (paginated) |
| `POST` | `/api/reviews` | Create a review |
| `GET` | `/api/reviews/:id` | Get review by ID |
| `PUT` | `/api/reviews/:id` | Update a review |
| `DELETE` | `/api/reviews/:id` | Delete a review |

## Database Schema

```
authors             books                reviews
┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│ id (PK)      │───<│ id (PK)      │────<│ id (PK)      │
│ name         │    │ title        │     │ content      │
│ created_at   │    │ author_id(FK)│     │ book_id (FK) │
│ updated_at   │    │ created_at   │     │ created_at   │
└──────────────┘    │ updated_at   │     │ updated_at   │
                    └──────────────┘     └──────────────┘

Author 1──* Book 1──* Review
Cascade delete: Author → Books → Reviews
```

## License

[MIT](LICENSE)