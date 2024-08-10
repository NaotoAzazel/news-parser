import { Blocks, News } from "../types/news"

export function formatChild(child: ChildNode): Blocks {
  const id = `_${Math.random().toString(36).substr(2, 9)}`

  switch (child.nodeName) {
    case "#text":
    case "DIV": {
      const trashSymbols = /^\s*$|\\+/

      if (!child.textContent) {
        throw new Error(`${child.nodeName} child have no text`)
      }

      if (trashSymbols.test(child.textContent)) {
        const sanitizedText = child.textContent.replace(/\n/g, "\\n")
        throw new Error(
          `${child.nodeName} have trash text, text: ${sanitizedText}`
        )
      }

      return {
        id,
        data: {
          text: child.textContent,
        },
        type: "paragraph",
      }
    }
    case "IMG": {
      const trashLink = /(https?:\/\/odpk\.org\.ua\/[^\s"']*)/g

      const imageElement = child as HTMLImageElement
      if (!imageElement.src) {
        throw new Error(`${child.nodeName} child have no src`)
      }

      if (!trashLink.test(imageElement.src)) {
        throw new Error(
          `${child.nodeName} have trash src, src: ${imageElement.src}`
        )
      }

      return {
        id,
        data: {
          file: {
            url: imageElement.src,
          },
          caption: "",
          stretched: false,
          withBorder: false,
          withBackground: false,
        },
        type: "image",
      }
    }
    default: {
      throw new Error("Unhandled element type")
    }
  }
}

export function formatRawNewsText(array: string[]): string[] {
  const trashSymbols = /^\s*$|\\+/
  return array.filter(Boolean).filter((line) => !trashSymbols.test(line))
}

interface FormatToNewsParams {
  title: string
  blocks: Blocks[]
}

export function formatToNews({
  blocks,
  title,
}: FormatToNewsParams): Omit<News, "id" | "createdAt" | "updatedAt"> {
  const now = new Date().getTime()

  return {
    title,
    content: { blocks, time: now, version: "2.29.1" },
    published: true,
  }
}
