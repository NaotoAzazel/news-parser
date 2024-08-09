import puppeteer from "puppeteer"
import { getFirstNewsLink, getNewsContent } from "./lib/actions"

async function start() {
  const browser = await puppeteer.launch({ headless: false }) // in prod: { headless: true }
  try {
    const page = await browser.newPage()

    await page.goto("https://odpk.org.ua/")
    const firstNewsLink = await getFirstNewsLink(page)

    await page.goto(firstNewsLink)

    const currentNewsContent = await getNewsContent(page)
    console.log("News content:", currentNewsContent)
  } catch (error) {
    console.error(error)
    await browser.close()
  } finally {
    await browser.close()
  }
}

start()
