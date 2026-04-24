import PageHeader from "@/components/layout/PageHeader";
import { Pagination } from "@/components/layout/Pagination";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/features/books/api";
import { BooksTable } from "@/features/books/BooksTable";
import { DeleteBookDialog } from "@/features/books/DeleteBookDialog";
import { UpdateBookDialog } from "@/features/books/UpdateBookDialog";
import type { Book } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 10;

const BooksListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useBooks(
    page,
    PAGE_SIZE,
  );

  const goToPage = (next: number) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set("page", String(next));
      return sp;
    });
  };
  return (
    <>
      <PageHeader
        section="Section 02 - Catalogue"
        title="Books"
        description="Every title on the shelf, pinned to an author. Edit, retire, or add new."
        action={
          <Button
            asChild
            className="h-11 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
          >
            <Link to="/books/new">
              <Plus className="h-4 w-4" />
              New Book
            </Link>
          </Button>
        }
      />
      {isError ? (
        <ErrorBlock message={error.message} onRetry={refetch} />
      ) : !isLoading && data && data.items.length === 0 ? (
        <EmptyBlock />
      ) : (
        <>
          <BooksTable
            data={data?.items ?? []}
            isLoading={isLoading}
            isFetching={isFetching}
            onEdit={setEditing}
            onDelete={setDeleting}
          />

          <Pagination
            page={page}
            totalPages={data?.total_pages ?? 1}
            total={data?.total ?? 0}
            pageSize={PAGE_SIZE}
            onChange={goToPage}
            label="books"
          />
        </>
      )}

      <UpdateBookDialog
        book={editing}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <DeleteBookDialog
        book={deleting}
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </>
  );
};

export default BooksListPage;

function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border-l-2 border-destructive pl-6 py-5 bg-destructive/5">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-destructive">
        Error · Could not load
      </div>
      <div className="mt-2 font-display text-2xl">Something went wrong</div>
      <div className="mt-1 text-sm text-ink-muted">{message}</div>
      <button
        onClick={onRetry}
        className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent-deep underline"
      >
        Retry -{" "}
      </button>
    </div>
  );
}

function EmptyBlock() {
  return (
    <div className="border-t border-b border-rule py-24 text-center">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-faint">
        Empty Shelf
      </div>
      <div className="mt-4 font-display text-4xl font-semibold">
        No books yet.
      </div>
      <p className="mt-3 text-ink-muted max-w-sm mx-auto">
        The shelf is waiting. Add the first title to begin.
      </p>
      <Button
        asChild
        className="mt-8 h-11 px-6 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
      >
        <Link to={"/books/new"}>
          <Plus className="h-4 w-4" />
          Add the first book
        </Link>
      </Button>
    </div>
  );
}
