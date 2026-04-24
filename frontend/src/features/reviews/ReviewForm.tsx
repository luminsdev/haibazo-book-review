import { Controller, useForm } from "react-hook-form";
import { useBookOptions } from "../books/api";
import {
  REVIEW_MAX_LENGTH,
  reviewFormSchema,
  type ReviewFormValues,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  defaultValues?: ReviewFormValues;
  onSubmit: (values: ReviewFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
};

export function ReviewForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isSubmitting,
  autoFocus,
}: Props) {
  const { data: books, isLoading: loadingBooks } = useBookOptions();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: defaultValues ?? { content: "", book_id: 0 },
    mode: "onBlur",
  });
  const contentError = form.formState.errors.content?.message;
  const bookError = form.formState.errors.book_id?.message;
  const content = form.watch("content") ?? "";
  const count = content.length;
  const noBooks = !loadingBooks && (books?.length ?? 0) === 0;

  if (noBooks) {
    return (
      <div className="border-l-2 border-accent pl-6 py-4 bg-accent-soft/40 rounded-xs">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent-deep">
          Missing prerequisite
        </div>
        <p className="mt-2 font-display text-xl leading-snug">
          No books on the shelf yet.
        </p>
        <p className="mt-2 text-ink-muted text-sm">
          A review needs a book to attach to. Add one first.
        </p>
        <Button
          asChild
          className="mt-5 h-10 px-5 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
        >
          <Link to="/books/new">Add a book →</Link>
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
          htmlFor="review-book"
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted"
        >
          Book
        </label>
        <Controller
          control={form.control}
          name="book_id"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(v) => field.onChange(Number(v))}
              disabled={loadingBooks || isSubmitting}
            >
              <SelectTrigger
                id="review-book"
                aria-invalid={!!bookError}
                className={cn(
                  "h-12 bg-paper-deep/60 border-rule font-display text-lg rounded-xs",
                  "focus:ring-accent focus:ring-offset-0",
                  "data-[placeholder]:font-sans data-[placeholder]:text-base data-[placeholder]:text-ink-faint",
                  bookError && "border-destructive",
                )}
              >
                <SelectValue
                  placeholder={loadingBooks ? "Loading books…" : "Pick a book"}
                />
              </SelectTrigger>
              <SelectContent className="bg-paper border-rule-strong rounded-xs max-h-96">
                {books?.map((b) => (
                  <SelectItem
                    key={b.id}
                    value={String(b.id)}
                    textValue={b.title}
                    className="py-2.5 focus:bg-paper-deep focus:text-accent rounded-xs items-start"
                  >
                    <div className="flex flex-col">
                      <span className="font-display text-base leading-tight">
                        {b.title}
                      </span>
                      <span className="font-display italic text-xs text-ink-muted leading-tight mt-0.5">
                        by {b.author.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {bookError && (
          <p className="font-mono text-xs text-destructive">— {bookError}</p>
        )}
      </div>
      <div className="space-y-3">
        <label
          htmlFor="review-content"
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted"
        >
          Review
        </label>
        <Textarea
          id="review-content"
          autoFocus={autoFocus}
          placeholder="What did you think? Be honest — the page can take it."
          aria-invalid={!!contentError}
          className={cn(
            "min-h-50 bg-paper-deep/60 border-rule rounded-xs p-4",
            "font-display text-lg leading-relaxed resize-none",
            "focus-visible:ring-accent focus-visible:ring-offset-0",
            contentError && "border-destructive",
          )}
          {...form.register("content")}
        />
        <div className="flex items-center justify-between">
          <div>
            {contentError && (
              <p className="font-mono text-xs text-destructive">
                — {contentError}
              </p>
            )}
          </div>
          <div
            className={cn(
              "font-mono text-[11px] tabular-nums tracking-wider",
              count > REVIEW_MAX_LENGTH
                ? "text-destructive"
                : count > REVIEW_MAX_LENGTH * 0.9
                  ? "text-accent"
                  : "text-ink-faint",
            )}
          >
            {count.toLocaleString()} / {REVIEW_MAX_LENGTH.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || loadingBooks}
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
}
