import type { Review } from "@/lib/types";
import { useDeleteReview } from "./api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Props = {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX_PREVIEW = 140;

export const DeleteReviewDialog = ({ review, open, onOpenChange }: Props) => {
  const mutation = useDeleteReview();

  if (!review) return null;

  const preview =
    review.content.length > MAX_PREVIEW
      ? review.content.slice(0, MAX_PREVIEW).trimEnd() + "..."
      : review.content;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-paper border-rule-strong rounded-xs p-0">
        <AlertDialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-3">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-destructive">
            Destructive · Permanent
          </div>
          <AlertDialogTitle className="font-display text-2xl font-semibold leading-tight">
            Withdraw this verdict?
          </AlertDialogTitle>

          <blockquote className="border-l-2 border-rule pl-4 py-1">
            <p className="font-display italic text-sm text-ink-muted leading-snug">
              &ldquoo;{preview}&rdquo;
            </p>
            <footer className=" mt-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink-faint">
              - on{" "}
              <span className="text-ink-muted normal-case tracking-normal font-display not-italic">
                {review.book.title}
              </span>
            </footer>
          </blockquote>

          <AlertDialogDescription className="text-ink-muted text-sm leading-relaxed">
            The review will be removed. The book and its author remain
            untouched.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="px-8 py-6 gap-2 flex-row justify-end">
          <AlertDialogCancel
            disabled={mutation.isPending}
            className="h-10 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs border-rule text-ink-muted hover:text-ink"
          >
            Keep
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={async (e) => {
              e.preventDefault();
              try {
                await mutation.mutateAsync(review.id);
                toast.success("Review withdrawn");
                onOpenChange(false);
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Delete failed",
                );
              }
            }}
            className="h-10 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs bg-destructive text-paper hover:bg-[#8f2513]"
          >
            {mutation.isPending ? "Withdrawing..." : "Withdraw"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
