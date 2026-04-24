import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Author } from "@/lib/types";
import { AuthorForm } from "./AuthorForm";
import { useUpdateAuthor } from "./api";

type Props = {
  author: Author | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UpdateAuthorDialog = ({ author, open, onOpenChange }: Props) => {
  const mutation = useUpdateAuthor();

  if (!author) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-paper border-rule-strong rounded-xs p-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-rule space-y-2">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
            Edit · Author № {String(author.id).padStart(3, "0")}
          </div>
          <DialogTitle className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Revise author
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Rename this author. Books and reviews attached to them remain
            intact.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-7">
          <AuthorForm
            autoFocus
            defaultValues={{ name: author.name }}
            submitLabel="Save changes"
            isSubmitting={mutation.isPending}
            onCancel={() => onOpenChange(false)}
            onSubmit={async (values) => {
              try {
                await mutation.mutateAsync({ id: author.id, values });
                toast.success(`Updated — ${values.name}`);
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
