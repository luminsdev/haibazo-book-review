import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  data: Book[];
  isLoading?: boolean;
  isFetching?: boolean;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

const COLS = "grid-cols-[56px_1fr_140px_96px]";

export const BooksTable = ({
  data,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div
      className={cn(
        "relative border-t border-b border-rule",
        isFetching && !isLoading && "opacity-70 transition-opacity",
      )}
    >
      <div
        className={cn(
          "grid items-center px-2 py-4 border-b border-rule",
          "font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted",
          COLS,
        )}
        role="row"
      >
        <div className="pl-2">№</div>
        <div>Title · Author</div>
        <div>Added</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : (
        data.map((book) => (
          <div
            key={book.id}
            className={cn(
              "grid items-center px-2 py-5 border-b border-rule last:border-b-0",
              "hover:bg-paper-deep/50 transition-colors",
              COLS,
            )}
            role="row"
          >
            <div className="pl-2 font-mono text-xs tabular-nums text-ink-faint self-start pt-1">
              {String(book.id).padStart(3, "0")}
            </div>
            <div className="min-w-0 pr-6">
              <div className="font-display text-xl leading-tight truncate">
                {book.title}
              </div>
              <div className="mt-1 font-display italic text-sm text-ink-muted truncate">
                by {book.author.name}
              </div>
            </div>
            <div className="font-mono text-xs text-ink-muted self-start pt-1">
              {formatDate(book.created_at)}
            </div>
            <div className="flex justify-end gap-1 pr-1 self-start pt-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(book)}
                className="h-9 w-9 text-ink-muted hover:text-accent hover:bg-transparent rounded-xs"
                aria-label={`Edit ${book.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(book)}
                className="h-9 w-9 text-ink-muted hover:text-destructive hover:bg-transparent rounded-xs"
                aria-label={`Delete ${book.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

function SkeletonRows() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "grid items-center px-2 py-5 border-b border-rule last:border-b-0",
            COLS,
          )}
        >
          <Skeleton className="h-3 w-8 rounded-xs bg-rule self-start mt-1" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-xs bg-rule" />
            <Skeleton className="h-3 w-1/3 rounded-xs bg-rule" />
          </div>
          <Skeleton className="h-3 w-20 rounded-xs bg-rule self-start mt-1" />
          <div className="flex justify-end gap-1 self-start">
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
          </div>
        </div>
      ))}
    </div>
  );
}
