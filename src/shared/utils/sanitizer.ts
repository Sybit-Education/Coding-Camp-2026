export function sanatizeTextLength(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  let sanitizedText = text.substring(0, maxLength)
  const lastSpaceIndex = sanitizedText.lastIndexOf(' ')
  if (lastSpaceIndex > 0) {
    sanitizedText = sanitizedText.substring(0, lastSpaceIndex)
  }

  sanitizedText = sanitizedText.replace(/[,:.]+$/, '')
  return sanitizedText + ' ...'
}
