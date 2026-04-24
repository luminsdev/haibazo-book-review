import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import type { Author } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  data: Author[];
  isLoading?: boolean;
  isFetching?: boolean;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
};

const COLS = "grid-cols-[56px_1fr_80px_140px_96px]";

export const AuthorsTable = ({
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
        <div className="pl-2">N</div>
        <div>Name</div>
        <div className="text-right tabular-nums pr-2">Books</div>
        <div>Added</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : (
        data.map((author) => (
          <div
            key={author.id}
            className={cn(
              "grid items-center px-2 py-5 border-b border-rule last:border-b-0",
              "hover:bg-paper-deep/50 transition-colors",
              COLS,
            )}
            role="row"
          >
            <div className=" pl-2 font-mono text-xs tabular-nums text-ink-faint">
              {String(author.id).padStart(3, "0")}
            </div>
            <div className="font-display text-xl leading-tight truncate">
              {author.name}
            </div>
            <div className="text-right font-mono text-sm tabular-nums text-ink-muted pr-2">
              {author.books_count}
            </div>
            <div className="font-mono text-xs text-ink-muted">
              {formatDate(author.created_at)}
            </div>
            <div className="flex justify-end gap-1 pr-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(author)}
                className="h-9 w-9 text-ink-muted hover:text-accent hover:bg-transparent rounded-xs"
                aria-label={`Edit ${author.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(author)}
                className="h-9 w-9 text-ink-muted hover:text-destructive hover:bg-transparent rounded-xs"
                aria-label={`Delete ${author.name}`}
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
          <Skeleton className="h-3 w-8 rounded-xs bg-rule" />
          <Skeleton className="h-5 w-2/3 rounded-xs bg-rule" />
          <Skeleton className="h-3 w-6 ml-auto rounded-xs bg-rule" />
          <Skeleton className="h-3 w-20 rounded-xs bg-rule" />
          <div className="flex justify-end gap-1">
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
          </div>
        </div>
      ))}
    </div>
  );
}
