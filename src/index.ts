import puppeteer, { Page } from "puppeteer"
import { Database } from "./classes/database/database.class"
import {
  getArticleNews,
  getFirstNewsLink,
  getNewsTitle,
  hasPrevPage,
} from "./lib/actions"
import { formatToNews } from "./lib/utils"

async function parseNews(page: Page) {
  const currentNewsTitle = await getNewsTitle(page)
  const currentNewsContent = await getArticleNews(page)

  const formatted = await formatToNews({
    blocks: currentNewsContent,
    title: currentNewsTitle,
  })

  const { hasPreviousPage, linkToPrevPage } = await hasPrevPage(page)

  return {
    formattedNews: formatted,
    hasPreviousPage,
    linkToPrevPage,
  }
}

async function start() {
  const db = new Database()

  try {
    await db.connect()
  } catch (error) {
    console.log("Error when trying to connect to database:", error)
    process.exit(1)
  }

  const browser = await puppeteer.launch({ headless: true }) // in prod: { headless: true }
  try {
    let nowParsingPageLink: string

    const page = await browser.newPage()

    await page.goto("https://odpk.org.ua/")
    const firstNewsLink = await getFirstNewsLink(page)
    await page.goto(firstNewsLink)

    let isContinue: boolean = true

    while (isContinue) {
      const { formattedNews, hasPreviousPage, linkToPrevPage } =
        await parseNews(page)

      if (hasPreviousPage) {
        await page.goto(linkToPrevPage as string)
        nowParsingPageLink = linkToPrevPage as string
        console.log("Now parsing news with link:", nowParsingPageLink)
      }

      const { id } = await db.createNews(formattedNews)
      console.log(`News is stored in the database with id: ${id}`)

      isContinue = hasPreviousPage
    }
  } catch (error) {
    console.error(error)
    await browser.close()
  } finally {
    await browser.close()
  }
}

start()
