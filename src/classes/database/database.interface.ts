import { News } from "../../types/news"

export interface IDatabase {
  connect: () => Promise<void>
  createNews: (
    news: Omit<News, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ id: number }>
}
