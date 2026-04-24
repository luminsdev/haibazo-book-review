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
import type { Author } from "@/lib/types";
import { useDeleteAuthor } from "./api";

type Props = {
  author: Author | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteAuthorDialog = ({ author, open, onOpenChange }: Props) => {
  const mutation = useDeleteAuthor();

  if (!author) return null;

  const booksCount = author.books_count;
  const hasCascade = booksCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-paper border-rule-strong rounded-xs p-0">
        <AlertDialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-2">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-destructive">
            Destructive · Permanent
          </div>
          <AlertDialogTitle className="font-display text-2xl font-semibold leading-tight">
            Delete <em className="text-accent not-italic">{author.name}</em>?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-ink-muted text-[15px] leading-relaxed">
            {hasCascade ? (
              <>
                This author has{" "}
                <span className="font-mono text-ink">{booksCount}</span>{" "}
                {booksCount === 1 ? "book" : "books"} in the catalogue. Deleting
                them will also remove{" "}
                <span className="text-ink">every book and review</span>{" "}
                attached. This cannot be undone.
              </>
            ) : (
              "This action is permanent. The author will be removed from the catalogue."
            )}
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
                await mutation.mutateAsync(author.id);
                toast.success(`Deleted — ${author.name}`);
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
