import * as core from '@actions/core'
import { textContains } from './text_contains'
const {GitHub, context} = require('@actions/github')
const parse = require('parse-diff')

async function run(): Promise<void> {
  try {
    const words: string[] = core
      .getInput('words')
      .split('\n')
      .map(s => s.trim())
      .filter(x => x !== '')

    const token = core.getInput('github-token', {required: true})
    const github = new GitHub(token, {})
    const diff_url = context.payload.pull_request.diff_url
    const result = await github.request(diff_url)
    const files = parse(result.data)

    core.exportVariable('files', files)
    core.setOutput('files', files)

    let changes: string = ''

    files.forEach(function (file: {additions: number; chunks: any[]}) {
      file.chunks.forEach(function (chunk) {
        chunk.changes.forEach(function (change: {add: any; content: string}) {
          if (change.add) {
            changes += change.content
          }
        })
      })
    })
    const includesWords = await textContains(changes, words)
    if (includesWords) {
      core.setFailed(`The PR contains one or more of the following words: ${words.join(', ')}`)
    } else {
      core.exportVariable('diff', changes)
      core.setOutput('diff', changes)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
