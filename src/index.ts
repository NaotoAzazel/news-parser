import puppeteer from "puppeteer"
import { getArticleNews, getFirstNewsLink, getNewsTitle } from "./lib/actions"
import { formatToNews } from "./lib/utils"

async function start() {
  const browser = await puppeteer.launch({ headless: true }) // in prod: { headless: true }
  try {
    const page = await browser.newPage()

    await page.goto("https://odpk.org.ua/")
    const firstNewsLink = await getFirstNewsLink(page)
    await page.goto(firstNewsLink)

    const currentNewsTitle = await getNewsTitle(page)
    const currentNewsContent = await getArticleNews(page)

    const formatted = formatToNews({
      blocks: currentNewsContent,
      title: currentNewsTitle,
    })

    console.log("Formatted:", formatted)
  } catch (error) {
    console.error(error)
    await browser.close()
  } finally {
    await browser.close()
  }
}

start()
