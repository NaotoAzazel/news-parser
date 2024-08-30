import { svg } from '../config/svg'
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

const toBase64 = (src: string) => Buffer.from(src).toString("base64")

interface FormatToNewsParams {
  title: string
  blocks: Blocks[]
}

export async function formatToNews({
  blocks,
  title,
}: FormatToNewsParams): Promise<Omit<News, "id" | "createdAt" | "updatedAt">> {
  const now = new Date().getTime()

  const blocksWithBase64 = await Promise.all(
    blocks.map(async (block) => {
      if (block.type === "image" && !block.data.file.base64) {
        const base64 = toBase64(block.data.file.url)
        const resultedBlurSVG = svg.blurSVG(base64) 

        return {
          ...block,
          data: {
            ...block.data,
            file: {
              ...block.data.file,
              base64: `data:image/svg+xml;base64,${resultedBlurSVG}`,
            },
          },
        }
      }

      return block
    })
  )

  return {
    title,
    content: { blocks: blocksWithBase64, time: now, version: "2.29.1" },
    published: true,
  }
}
