import { toast } from "sonner";
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
import type { Book } from "@/lib/types";
import { useDeleteBook } from "./api";

type Props = {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteBookDialog = ({ book, open, onOpenChange }: Props) => {
  const mutation = useDeleteBook();

  if (!book) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-paper border-rule-strong rounded-xs p-0">
        <AlertDialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-2">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-destructive">
            Destructive · Permanent
          </div>
          <AlertDialogTitle className="font-display text-2xl font-semibold leading-tight">
            Delete <em className="text-accent not-italic">{book.title}</em>?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-ink-muted text-[15px] leading-relaxed">
            Every review attached to this book will also be removed. The author
            <span className="text-ink"> {book.author.name}</span> stays in the
            catalogue.
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
                await mutation.mutateAsync(book.id);
                toast.success(`Deleted — ${book.title}`);
                onOpenChange(false);
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Delete failed",
                );
              }
            }}
            className="h-10 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs bg-destructive text-paper hover:bg-[#8f2513]"
          >
            {mutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
