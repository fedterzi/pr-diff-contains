/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import * as core from '@actions/core'
import {textContains} from './text_contains'
import * as github from '@actions/github'
const parse = require('parse-diff')

async function run(): Promise<void> {
  try {
    const words: string[] = core
      .getInput('words')
      .split('\n')
      .map(s => s.trim())
      .filter(x => x !== '')

    const token = core.getInput('github-token', {required: true})
    const octokit = github.getOctokit(token)
    const diff_url = github.context?.payload?.pull_request?.diff_url
    core.setOutput('diff_url', diff_url)
    const result = await octokit.request(diff_url)
    const files = parse(result.data)

    core.exportVariable('files', files)
    core.setOutput('files', files)

    let changes = ''
    for (const file of files) {
      for (const chunk of file.chunks) {
        for (const change of chunk.changes) {
          if (change.add) {
            changes += change.content
          }
        }
      }
    }

    core.info(changes)
    core.info(`words are ${words.join()}`)

    const includesWords = await textContains(changes, words)
    if (includesWords) {
      core.setFailed(
        `The PR contains one or more of the following words: ${words.join(
          ', '
        )}`
      )
    } else {
      core.exportVariable('diff', changes)
      core.setOutput('diff', changes)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
