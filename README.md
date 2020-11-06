<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# pr-diff-contains

Action that fails if the pull request diff contains one or more specified words.

## Code in Main

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
...
```

## Using this action

Please use this action only on `pull_request` events, it won't work anywhere else.
The words array contains the words that would make the action fail if they are present in the PR changes.
Do not quote/double quote the words because that would search for quoted/double quoted words (unless that's what you want to do).

```yaml
name: "Check forbidden words"
on: [pull_request]

jobs:
  check_pr:
    runs-on: ubuntu-latest
    steps:
    - name: Check forbidden words
      uses: fedterzi/pr-diff-contains@releases/v1
      with:
        github-token: ${{github.token}}
        words: |
            Cache-Control
            cache-control
```

