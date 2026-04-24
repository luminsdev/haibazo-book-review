import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  label?: string;
};

export const Pagination = ({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
  label = "entries",
}: Props) => {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between pt-6 font-mono text-xs text-ink-muted">
      <div className="tabular-nums tracking-wider">
        {total === 0 ? (
          <span className="italic">no {label}</span>
        ) : (
          <>
            Showing <span className="text-ink">{from}</span>–
            <span className="text-ink">{to}</span> of{" "}
            <span className="text-ink">{total}</span> {label}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={!canPrev}
          className={cn(
            "h-9 px-3 font-mono text-xs uppercase tracking-[0.2em] rounded-xs",
            "text-ink-muted hover:text-ink hover:bg-paper-deep",
            "disabled:opacity-30",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </Button>

        <span className="px-3 tabular-nums tracking-wider">
          <span className="text-ink">{page}</span>
          <span className="text-ink-faint"> / {Math.max(totalPages, 1)}</span>
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={!canNext}
          className={cn(
            "h-9 px-3 font-mono text-xs uppercase tracking-[0.2em] rounded-xs",
            "text-ink-muted hover:text-ink hover:bg-paper-deep",
            "disabled:opacity-30",
          )}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
