import "@prisma/client"

import { Blocks } from "./news"

declare global {
  namespace PrismaJson {
    type Content = {
      blocks: Blocks[]
      time: number
      version: string
    }
  }
}
