export function formatChild(child: ChildNode): string {
  let result: string

  switch (child.nodeName) {
    case "DIV": {
      result = child.textContent ?? "DIV child have no text"
      break
    }
    case "IMG": {
      const imageElement = child as HTMLImageElement
      result = imageElement.src ?? "IMG child have no src"
      break
    }
    case "#text": {
      result = child.textContent ?? "#text child have no text"
      break
    }
    default: {
      result = "Unhandled element type"
      break
    }
  }

  return result
}

export function formatNewsContent(array: string[]): string[] {
  const trashSymbols = /^\s*$|\\+/
  return array.filter(Boolean).filter((line) => !trashSymbols.test(line))
}
