import { db } from "../../lib/db"
import { News } from "../../types/news"
import { IDatabase } from "./database.interface"

export class Database implements IDatabase {
  async connect() {
    try {
      await db.$connect()
      console.log("Successfully connected to database")
    } catch (error) {
      await db.$disconnect()
      throw error
    }
  }

  async createNews(news: Omit<News, "id" | "createdAt" | "updatedAt">) {
    const createdNews = await db.post.create({
      select: {
        id: true,
      },
      data: news,
    })

    return createdNews
  }
}
