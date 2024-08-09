import { Page } from "puppeteer"
import { formatChild, formatNewsContent } from "./utils"

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

export async function getNewsContent(page: Page) {
  const rawNewsContent = await getArticleNews(page)
  const formattedResult = formatNewsContent(rawNewsContent)
  return formattedResult
}

export async function getArticleNews(page: Page) {
  return await page
    .evaluate((formatChildFuncString) => {
      // Use this approach cuz browser environment
      // does not see this function
      const formatChildFunc = new Function(
        `return (${formatChildFuncString})`
      )()

      const currentNewsArticle = document.querySelector(".article-inner")
      if (!currentNewsArticle) {
        throw new Error("Cannot find news article")
      }

      const newsContent = currentNewsArticle.querySelector(".entry-content")
      if (!newsContent) {
        throw new Error("Cannot find news content")
      }

      function getLeafNodes(node: Element): string[] {
        const result: string[] = []

        node.childNodes.forEach((child) => {
          if (child.hasChildNodes()) {
            result.push(...getLeafNodes(child as Element))
          } else {
            result.push(formatChildFunc(child))
          }
        })

        return result
      }

      return getLeafNodes(newsContent)
    }, formatChild.toString())
    .then((result) => {
      return result
    })
}
