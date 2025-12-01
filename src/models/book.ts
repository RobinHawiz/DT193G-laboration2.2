// Represents a single book entry stored in a database
export type BookEntity = {
  id: number;
  title: string;
  publishedYear: number;
  // 0 === false, 1 === true
  isRead: 0 | 1;
};

export type BookPayload = Omit<BookEntity, "id">;
