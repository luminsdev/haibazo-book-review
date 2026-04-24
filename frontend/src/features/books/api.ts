import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { bookKeys } from "@/lib/query-keys";
import type { Book, BookOption, Paginated } from "@/lib/types";
import type { BookFormValues } from "./schema";

async function fetchBooks(page: number, pageSize: number) {
  const { data } = await api.get<Paginated<Book>>("/books", {
    params: { page, page_size: pageSize },
  });
  return data;
}

async function fetchBookOptions() {
  const { data } = await api.get<BookOption[]>("/books/options");
  return data;
}

async function createBook(payload: BookFormValues) {
  const { data } = await api.post<Book>("/books", payload);
  return data;
}

async function updateBook(id: number, payload: BookFormValues) {
  const { data } = await api.put<Book>(`/books/${id}`, payload);
  return data;
}

async function deleteBook(id: number) {
  await api.delete(`/books/${id}`);
}

export function useBooks(page: number, pageSize: number) {
  return useQuery({
    queryKey: bookKeys.list({ page, pageSize }),
    queryFn: () => fetchBooks(page, pageSize),
    placeholderData: (prev) => prev,
  });
}

export function useBookOptions() {
  return useQuery({
    queryKey: bookKeys.options(),
    queryFn: fetchBookOptions,
    staleTime: 60_000,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookKeys.all });
      qc.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; values: BookFormValues }) =>
      updateBook(args.id, args.values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookKeys.all });
      qc.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookKeys.all });
      qc.invalidateQueries({ queryKey: ["authors"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
