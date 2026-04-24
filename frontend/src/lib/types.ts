export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type Author = {
  id: number;
  name: string;
  books_count: number;
  created_at: string;
  updated_at: string;
};

export type AuthorOption = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  title: string;
  author: { id: number; name: string };
  created_at: string;
  updated_at: string;
};

export type BookOption = {
  id: number;
  title: string;
  author: { id: number; name: string };
};

export type Review = {
  id: number;
  content: string;
  book: {
    id: number;
    title: string;
    author: { id: number; name: string };
  };
  created_at: string;
  updated_at: string;
};
