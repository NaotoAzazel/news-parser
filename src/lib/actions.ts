import { Page } from "puppeteer"
import { Blocks } from "../types/news"
import { formatChild } from "./utils"

export async function getFirstNewsLink(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const firstNewsContainer = document.querySelector("#lp-boxes-2 > div")
    if (!firstNewsContainer) {
      throw new Error("Cannot find first news container")
    }

    const linkToFirstNews: string | undefined =
      firstNewsContainer.querySelector("a")?.href

    if (!linkToFirstNews) {
      throw new Error("Cannot find a link to the first news item")
    }

    return linkToFirstNews
  })
}

export async function getArticleNews(page: Page) {
  return await page
    .evaluate((formatChildFuncString) => {
      // Use this approach cuz browser environment
      // does not see this function
      const formatChildFunc = new Function(
        `return (${formatChildFuncString})`
      )()

      const errors: string[] = []

      const currentNewsArticle = document.querySelector(".article-inner")
      if (!currentNewsArticle) {
        throw new Error("Cannot find news article")
      }

      const newsContent = currentNewsArticle.querySelector(".entry-content")
      if (!newsContent) {
        throw new Error("Cannot find news content")
      }

      function getLeafNodes(node: Element): Blocks[] {
        const result: Blocks[] = []

        node.childNodes.forEach((child) => {
          try {
            if (child.hasChildNodes()) {
              result.push(...getLeafNodes(child as Element))
            } else {
              result.push(formatChildFunc(child))
            }
          } catch (error) {
            if (error instanceof Error) {
              errors.push(`Skipping node due to error: ${error.message}`)
            }
          }
        })

        return result
      }

      return { blocks: getLeafNodes(newsContent), errors }
    }, formatChild.toString())
    .then((result) => {
      if (result.errors.length) {
        console.warn("Errors occurred during processing:")
        result.errors.forEach((error) => console.warn(error))
      }

      return result.blocks
    })
}

export async function getNewsTitle(page: Page) {
  return await page.evaluate(() => {
    const title = document.title
    const newsTitle = title.split(" - ")[0]
    return newsTitle
  })
}
