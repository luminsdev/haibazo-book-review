import PageHeader from "@/components/layout/PageHeader";
import { useCreateAuthor } from "@/features/authors/api";
import { AuthorForm } from "@/features/authors/AuthorForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthorCreatePage = () => {
  const navigate = useNavigate();
  const mutation = useCreateAuthor();
  return (
    <>
      <PageHeader
        section="Section 01 - New Entry"
        title="New Author"
        description="Add a new voice to the catalogue."
      />
      <div className="max-w-xl border-1-2 border-rule pl-8 py-2">
        <AuthorForm
          autoFocus
          submitLabel="Add Author"
          isSubmitting={mutation.isPending}
          onCancel={() => navigate("/authors")}
          onSubmit={async (values) => {
            try {
              const author = await mutation.mutateAsync(values);
              toast.success(`Added - ${author.name}`);
              navigate("/authors");
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to add author",
              );
            }
          }}
        />
      </div>
    </>
  );
};

export default AuthorCreatePage;
