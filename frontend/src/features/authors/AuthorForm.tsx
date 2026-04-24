import { authorFormSchema, type AuthorFormValues } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  defaultValues?: AuthorFormValues;
  onSubmit: (values: AuthorFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  autoFocus: boolean;
};

export function AuthorForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  autoFocus,
}: Props) {
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: defaultValues ?? { name: "" },
    mode: "onBlur",
  });

  const nameError = form.formState.errors.name?.message;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
    >
      <div className="space-y-3">
        <label
          htmlFor="author-name"
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted"
        >
          Author Name
        </label>
        <Input
          id="author-name"
          placeholder="e.g Haruki Murakami"
          autoFocus={autoFocus}
          aria-invalid={!!nameError}
          className={cn(
            "h12 bg-paper-deep/60 border-rule font-display text-xl",
            "focus-visible:ring-accent focus-visible:ring-offset-0",
            nameError && "border-destructive",
          )}
          {...form.register("name")}
        />
        {nameError && (
          <p className="font-mono text-xs text-destructive">- {nameError}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h=11 px-6 font-mono text-xs uppercase tracking-[0.2em] rounded-xs"
        >
          {isSubmitting ? "Saving" : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 px-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
          ></Button>
        )}
      </div>
    </form>
  );
}
