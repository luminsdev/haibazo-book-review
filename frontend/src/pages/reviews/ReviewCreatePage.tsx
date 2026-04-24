import PageHeader from "@/components/layout/PageHeader";
import { useCreateReview } from "@/features/reviews/api";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ReviewCreatePage = () => {
  const navigate = useNavigate();
  const mutation = useCreateReview();
  return (
    <>
      <PageHeader
        section="Section 03 - New Entry"
        title="New Review"
        description="Pick a book, have a think, leave an honest take. Long or short - both count."
      />
      <div className="max-w-2xl border-l-2 border-rule pl-8 py-2">
        <ReviewForm
          autoFocus
          submitLabel="Publish Review"
          isSubmitting={mutation.isPending}
          onCancel={() => navigate("/reviews")}
          onSubmit={async (values) => {
            try {
              await mutation.mutateAsync(values);
              toast.success("Review published");
              navigate("/reviews");
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to public review",
              );
            }
          }}
        />
      </div>
    </>
  );
};

export default ReviewCreatePage;
