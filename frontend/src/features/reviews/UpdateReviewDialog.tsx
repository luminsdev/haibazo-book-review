import type { Review } from "@/lib/types";
import { useUpdateReview } from "./api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";
import { toast } from "sonner";

type Props = {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UpdateReviewDialog = ({ review, open, onOpenChange }: Props) => {
  const mutation = useUpdateReview();

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-paper border-rule-strong rounded-xs p-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-2">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
            Edit · Review № {String(review.id).padStart(3, "0")}
          </div>
          <DialogTitle className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Revise verdict
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Change the attached book or rewrite your take. Second thoughts are
            welcome.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-7 max-h-[70vh] overflow-y-auto">
          <ReviewForm
            autoFocus
            defaultValues={{ content: review.content, book_id: review.book.id }}
            submitLabel="Save changes"
            isSubmitting={mutation.isPending}
            onCancel={() => onOpenChange(false)}
            onSubmit={async (values) => {
              try {
                await mutation.mutateAsync({ id: review.id, values });
                toast.success("Review updated");
                onOpenChange(false);
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Update failed",
                );
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
