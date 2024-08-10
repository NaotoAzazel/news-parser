import puppeteer, { Page } from "puppeteer"
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

  const formatted = formatToNews({
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
  const browser = await puppeteer.launch({ headless: true }) // in prod: { headless: true }
  try {
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
      }

      console.log(formattedNews)

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
