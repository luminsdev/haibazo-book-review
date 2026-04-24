import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { authorKeys } from "@/lib/query-keys";
import type { Author, AuthorOption, Paginated } from "@/lib/types";
import type { AuthorFormValues } from "./schema";

async function fetchAuthors(page: number, pageSize: number) {
  const { data } = await api.get<Paginated<Author>>("/authors", {
    params: { page, page_size: pageSize },
  });
  return data;
}

async function fetchAuthorOptions() {
  const { data } = await api.get<AuthorOption[]>("/authors/options");
  return data;
}

async function createAuthor(payload: AuthorFormValues) {
  const { data } = await api.post<Author>("/authors", payload);
  return data;
}

async function updateAuthor(id: number, payload: AuthorFormValues) {
  const { data } = await api.put<Author>(`/authors/${id}`, payload);
  return data;
}

async function deleteAuthor(id: number) {
  await api.delete(`/authors/${id}`);
}

export function useAuthors(page: number, pageSize: number) {
  return useQuery({
    queryKey: authorKeys.list({ page, pageSize }),
    queryFn: () => fetchAuthors(page, pageSize),
    placeholderData: (prev) => prev,
  });
}

export function useAuthorOptions() {
  return useQuery({
    queryKey: authorKeys.options(),
    queryFn: fetchAuthorOptions,
    staleTime: 60_000,
  });
}

export function useCreateAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authorKeys.all });
    },
  });
}

export function useUpdateAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; values: AuthorFormValues }) =>
      updateAuthor(args.id, args.values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authorKeys.all });
    },
  });
}

export function useDeleteAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authorKeys.all });
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
