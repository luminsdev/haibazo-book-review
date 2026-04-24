import PageHeader from "@/components/layout/PageHeader";
import { useCreateBook } from "@/features/books/api";
import { BookForm } from "@/features/books/BookForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BookCreatePage = () => {
  const navigate = useNavigate();
  const mutation = useCreateBook();
  return (
    <>
      <PageHeader
        section="Section 02 - New Entry"
        title="New Book"
        description="Pin a title to an existing author."
      />
      <div className="max-w-xl border-1-2 border-rule pl-8 py-2">
        <BookForm
          autoFocus
          submitLabel="Add Book"
          isSubmitting={mutation.isPending}
          onCancel={() => navigate("/books")}
          onSubmit={async (values) => {
            try {
              const book = await mutation.mutateAsync(values);
              toast.success(`Added - ${book.title}`);
              navigate("/books");
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to add book",
              );
            }
          }}
        />
      </div>
    </>
  );
};

export default BookCreatePage;
