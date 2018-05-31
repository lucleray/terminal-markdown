#!/usr/bin/env node

const unified = require('unified')
const markdown = require('remark-parse')
const inspect = require('unist-util-inspect')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const compiler = require('./lib/compiler')

function stringify() {
  this.Compiler = compiler
}

const processor = unified()
  .use(markdown)
  .use(stringify)

const args = process.argv

// expect stdin if no arg is provided
if (args.length <= 2) {
  let MD = ''

  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  process.stdin.on('data', function(chunk) {
    MD += chunk
  })

  process.stdin.on('end', function() {
    process.stdout.write(processor.processSync(MD).toString())
  })
} else {
  const filepath = args[2]
  try {
    const MD = fs.readFileSync(path.resolve(process.cwd(), filepath))
    console.log(processor.processSync(MD).toString())
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(chalk.bold.bgRed.white('ERROR') + ' File not found')
    } else {
      throw e
    }
  }
}
