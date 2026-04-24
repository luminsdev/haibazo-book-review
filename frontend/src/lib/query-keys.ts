export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...authorKeys.lists(), params] as const,
  options: () => [...authorKeys.all, "options"] as const,
  detail: (id: number) => [...authorKeys.all, "detail", id] as const,
};

export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...bookKeys.lists(), params] as const,
  options: () => [...bookKeys.all, "options"] as const,
  detail: (id: number) => [...bookKeys.all, "detail", id] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...reviewKeys.lists(), params] as const,
  detail: (id: number) => [...reviewKeys.all, "detail", id] as const,
};
