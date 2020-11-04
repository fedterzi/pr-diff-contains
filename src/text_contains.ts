export async function textContains(
  text: string,
  words: string[]
): Promise<boolean> {
  if (words.some(v => text.includes(v))) {
    return true
  } else {
    return false
  }
}
