import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { reviewKeys } from "@/lib/query-keys";
import type { Paginated, Review } from "@/lib/types";
import type { ReviewFormValues } from "./schema";

async function fetchReviews(page: number, pageSize: number) {
  const { data } = await api.get<Paginated<Review>>("/reviews", {
    params: { page, page_size: pageSize },
  });
  return data;
}

async function createReview(payload: ReviewFormValues) {
  const { data } = await api.post<Review>("/reviews", payload);
  return data;
}

async function updateReview(id: number, payload: ReviewFormValues) {
  const { data } = await api.put<Review>(`/reviews/${id}`, payload);
  return data;
}

async function deleteReview(id: number) {
  await api.delete(`/reviews/${id}`);
}

export function useReviews(page: number, pageSize: number) {
  return useQuery({
    queryKey: reviewKeys.list({ page, pageSize }),
    queryFn: () => fetchReviews(page, pageSize),
    placeholderData: (prev) => prev,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; values: ReviewFormValues }) =>
      updateReview(args.id, args.values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
