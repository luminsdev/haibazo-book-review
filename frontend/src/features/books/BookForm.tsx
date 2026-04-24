import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorOptions } from "@/features/authors/api";
import { cn } from "@/lib/utils";
import { bookFormSchema, type BookFormValues } from "./schema";

type Props = {
  defaultValues?: BookFormValues;
  onSubmit: (values: BookFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
};

export const BookForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isSubmitting,
  autoFocus,
}: Props) => {
  const { data: authors, isLoading: loadingAuthors } = useAuthorOptions();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: defaultValues ?? { title: "", author_id: 0 },
    mode: "onBlur",
  });

  const titleError = form.formState.errors.title?.message;
  const authorError = form.formState.errors.author_id?.message;

  const noAuthors = !loadingAuthors && (authors?.length ?? 0) === 0;

  if (noAuthors) {
    return (
      <div className="border-l-2 border-accent pl-6 py-4 bg-accent-soft/40 rounded-xs">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent-deep">
          Missing prerequisite
        </div>
        <p className="mt-2 font-display text-xl leading-snug">
          No authors in the catalogue yet.
        </p>
        <p className="mt-2 text-ink-muted text-sm">
          A book must be attached to an author. Add one first.
        </p>
        <Button
          asChild
          className="mt-5 h-10 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
        >
          <Link to="/authors/new">Add an author →</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
    >
      <div className="space-y-3">
        <label
          htmlFor="book-title"
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted"
        >
          Title
        </label>
        <Input
          id="book-title"
          placeholder="e.g. Norwegian Wood"
          autoFocus={autoFocus}
          aria-invalid={!!titleError}
          className={cn(
            "h-12 bg-paper-deep/60 border-rule font-display text-xl",
            "focus-visible:ring-accent focus-visible:ring-offset-0",
            titleError && "border-destructive",
          )}
          {...form.register("title")}
        />
        {titleError && (
          <p className="font-mono text-xs text-destructive">— {titleError}</p>
        )}
      </div>

      <div className="space-y-3">
        <label
          htmlFor="book-author"
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted"
        >
          Author
        </label>
        <Controller
          control={form.control}
          name="author_id"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(v) => field.onChange(Number(v))}
              disabled={loadingAuthors || isSubmitting}
            >
              <SelectTrigger
                id="book-author"
                aria-invalid={!!authorError}
                className={cn(
                  "h-12 bg-paper-deep/60 border-rule font-display text-lg rounded-xs",
                  "focus:ring-accent focus:ring-offset-0",
                  "data-[placeholder]:font-sans data-[placeholder]:text-base data-[placeholder]:text-ink-faint",
                  authorError && "border-destructive",
                )}
              >
                <SelectValue
                  placeholder={
                    loadingAuthors ? "Loading authors…" : "Pick an author"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-paper border-rule-strong rounded-xs max-h-80">
                {authors?.map((a) => (
                  <SelectItem
                    key={a.id}
                    value={String(a.id)}
                    className="font-display text-base py-2 focus:bg-paper-deep focus:text-accent rounded-xs"
                  >
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {authorError && (
          <p className="font-mono text-xs text-destructive">— {authorError}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || loadingAuthors}
          className="h-11 px-6 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 px-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
