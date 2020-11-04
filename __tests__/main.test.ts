import {textContains} from '../src/text_contains'

test('fails when a word is in text', async () => {
  const result = await textContains(
    `
  test PR
  abcdefghilmnopq
  asbdasda asdasasd asdtestword asdasd
  abcde
  `,
    ['testword', 'aaaaaa']
  )
  expect(result).toBe(true)
})

test('succeeds when a word is not in text', async () => {
  const result = await textContains(
    `
  test PR
  abcdefghilmnopq
  abcde
  `,
    ['testword', 'aaaaaa']
  )
  expect(result).toBe(false)
})
