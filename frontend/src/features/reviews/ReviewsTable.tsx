import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  data: Review[];
  isLoading?: boolean;
  isFetching?: boolean;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
};

const COLS = "grid-cols-[56px_1fr_120px_96px]";

export const ReviewsTable = ({
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
        <div>Verdict · Attribution</div>
        <div>Added</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : (
        data.map((review) => (
          <div
            key={review.id}
            className={cn(
              "grid items-start px-2 py-6 border-b border-rule last:border-b-0",
              "hover:bg-paper-deep/50 transition-colors",
              COLS,
            )}
            role="row"
          >
            <div className="pl-2 pt-1 font-mono text-xs tabular-nums text-ink-faint self-start">
              {String(review.id).padStart(3, "0")}
            </div>

            <blockquote className="min-w-0 pr-8 border-l-2 border-rule pl-5">
              <p className="font-display italic text-lg leading-snug text-ink line-clamp-2">
                &ldquo;{review.content}&rdquo;
              </p>
              <footer className="mt-2 font-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
                - on{" "}
                <span className="text-ink normal-case tracking-normal font-display not-italic">
                  {review.book.title}
                </span>
                {" . "}
                <span className="italic normal-case tracking-normal">
                  {review.book.author.name}
                </span>
              </footer>
            </blockquote>

            <div className="font-mono text-xs text-ink-muted pt-1">
              {formatDate(review.created_at)}
            </div>
            <div className="flex justify-end gap-1 pr-1 pt-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(review)}
                className="h-9 w-9 text-ink-muted hover:text-accent hover:bg-transparent rounded-xs"
                aria-label={`Edit review ${review.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(review)}
                className="h-9 w-9 text-ink-muted hover:text-destructive hover:bg-transparent rounded-xs"
                aria-label={`Delete review ${review.id}`}
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
          <Skeleton className="h-3 w-8 rounded-xs bg-rule mt-1" />
          <div className="space-y-2 pr-8 leading-5 border-l-2 border-rule/40">
            <Skeleton className="h-5 w-11/12 rounded-xs bg-rule" />
            <Skeleton className="h-5 w-3/4 rounded-xs bg-rule" />
            <Skeleton className="h-3 w-48 rounded-xs bg-rule mt-3" />
          </div>
          <Skeleton className="h-3 w-20 rounded-xs bg-rule mt-1" />
          <div className="flex justify-end gap-1">
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
            <Skeleton className="h-9 w-9 rounded-xs bg-rule" />
          </div>
        </div>
      ))}
    </div>
  );
}
