/**
 * Used for displaying a mid-split ellipsis text like
 * in the documents micros-app.
 *
 * Splits a string into two parts based on a fixed
 * length of the second part. E.g. "You are my hero baby"
 * is split into { left: "You are my", right: " hero baby" }
 *
 * If the string is shorter than the fixed right string
 * length, the whole input string is put into the `left`
 * part and the `right` part is an empty string. E.g. "Shorty"
 * turns into { left: "Shorty", right: "" }
 *
 * @param text Text to ellipsize
 * @param rightCharCount The length of the second part, default is 10
 * @return An object of shape { left:string, right:string }
 */
export function getEllipsisTextParts(text: string, rightCharCount = 10) {
  const ellipsisParts: { left: string; right: string } = {
    left: null,
    right: null,
  }
  const breakpoint =
    text.length < rightCharCount ? text.length : text.length - rightCharCount
  ellipsisParts.left = text.substr(0, breakpoint)
  ellipsisParts.right = text.substr(breakpoint) || ''
  return ellipsisParts
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatListItem(str: string, removeExtension = true) {
  // Remove optional extension
  const label = removeExtensionFromString(str, removeExtension)

  return capitalize(label)
}

function removeExtensionFromString(str: string, removeExtension: boolean) {
  if (removeExtension === true) {
    return str.indexOf('.') > 0 ? str.substr(0, str.lastIndexOf('.')) : str
  }

  return str
}
