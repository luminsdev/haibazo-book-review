import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Book } from "@/lib/types";
import { BookForm } from "./BookForm";
import { useUpdateBook } from "./api";

type Props = {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UpdateBookDialog = ({ book, open, onOpenChange }: Props) => {
  const mutation = useUpdateBook();

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-paper border-rule-strong rounded-xs p-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-2">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
            Edit · Book № {String(book.id).padStart(3, "0")}
          </div>
          <DialogTitle className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Revise book
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Change the title or reassign the author. Reviews attached to this
            book remain.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-7">
          <BookForm
            autoFocus
            defaultValues={{ title: book.title, author_id: book.author.id }}
            submitLabel="Save changes"
            isSubmitting={mutation.isPending}
            onCancel={() => onOpenChange(false)}
            onSubmit={async (values) => {
              try {
                await mutation.mutateAsync({ id: book.id, values });
                toast.success(`Updated — ${values.title}`);
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
