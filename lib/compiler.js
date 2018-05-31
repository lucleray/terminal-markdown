const chalk = require('chalk')
const terminalLink = require('terminal-link')
const { table, getBorderCharacters } = require('table')
const utilFindDefinitions = require('mdast-util-definitions')

let definitionsSingleton = null

const findDefinition = key =>
  definitionsSingleton ? definitionsSingleton(key) : null

const linkStyling = chalk.blue

const nodeToTerm = ({ type, children, ...node }) => {
  if (type === 'root') {
    return removeSpaces(nodesToTerm(children))
  }

  if (type === 'paragraph') {
    return '\n' + nodesToTerm(children) + '\n'
  }

  if (type === 'text') {
    return node.value || ''
  }

  if (type === 'strong') {
    return chalk.bold(nodesToTerm(children))
  }

  if (type === 'emphasis') {
    return chalk.italic(nodesToTerm(children))
  }

  if (type === 'delete') {
    return chalk.strikethrough(nodesToTerm(children))
  }

  if (type === 'link') {
    if (terminalLink.isSupported) {
      return linkStyling(terminalLink(nodesToTerm(children), node.url || ''))
    }
    return (
      linkStyling(nodesToTerm(children)) +
      (node.url ? chalk.gray(` (${node.url})`) : '')
    )
  }

  if (type === 'image') {
    return `[Image${node.alt ? ` : ${node.alt}` : ''}]`
  }

  if (type === 'heading') {
    return (
      '\n' +
      '#'.repeat(node.depth) +
      ' ' +
      chalk.bold(nodesToTerm(children)) +
      ' \n'
    )
  }

  if (type === 'inlineCode') {
    return chalk.magenta('`' + node.value + '`')
  }

  if (type === 'thematicBreak') {
    return '\n' + '─'.repeat(50) + '\n'
  }

  if (type === 'break') {
    return '\n'
  }

  if (type === 'table') {
    return '\n' + tableToTerm({ children, ...node }) + '\n'
  }

  if (type === 'blockquote') {
    return '\n' + blockquoteToTerm(nodesToTerm(children)) + '\n'
  }

  if (type === 'code') {
    return '\n' + codeToTerm(node.value) + '\n'
  }

  if (type === 'list') {
    return '\n' + listToTerm({ children, ...node }) + '\n'
  }

  if (type === 'linkReference' || type === 'imageReference') {
    const definition = findDefinition(node.identifier)

    return nodeToTerm({
      type: type === 'linkReference' ? 'link' : 'image',
      url: definition ? definition.url : null,
      title: definition ? definition.title : null,
      alt: node.alt,
      children
    })
  }
}

const nodesToTerm = nodes => nodes.map(node => nodeToTerm(node)).join('')

const removeExtraLines = text => text.replace(/\n{2,}/g, '\n')

const removeSpaces = text => text.trim().replace(/\n{3,}/g, '\n\n')

const findLineSize = lines => {
  const linesLength = lines.map(line => line.length)
  return Math.max(...linesLength)
}

const blockquoteToTerm = _text => {
  const text = removeExtraLines('\n' + _text.trim() + '\n')

  let outputStr = ''
  outputStr += text
    .split('\n')
    .map(line => chalk.dim('│  ') + line)
    .join('\n')

  return outputStr
}

const codeToTerm = _text => {
  const text = '\n' + _text + '\n'

  const lines = text.split('\n')
  const size = findLineSize(lines)

  let outputStr = chalk.dim(`┌${'─'.repeat(size + 4)}┐\n`)
  outputStr += lines
    .map(
      line =>
        chalk.dim('│  ') +
        line +
        ' '.repeat(size - line.length) +
        chalk.dim('  │')
    )
    .join('\n')
  outputStr += chalk.dim(`\n└${'─'.repeat(size + 4)}┘`)

  return outputStr
}

const tableToTerm = node => {
  const columns = {}

  node.align.forEach((value, i) => {
    columns[i] = {
      alignment: value || 'left'
    }
  })

  return table(
    node.children.map((row, i) =>
      row.children.map(
        cell =>
          i === 0
            ? chalk.bold(nodesToTerm(cell.children))
            : nodesToTerm(cell.children)
      )
    ),
    {
      // columns,
      border: getBorderCharacters('norc')
    }
  )
}

const listToTerm = node => {
  return node.children
    .map((item, i) => {
      const bullet = node.ordered ? `${i + node.start}. ` : '• '
      const check = item.checked ? '✔︎ ' : '✘ '
      const symbol = item.checked === null ? bullet : check
      return (
        symbol +
        nodesToTerm(item.children)
          .replace(/\n+/g, '\n')
          .replace(/\n/g, '\n   ')
          .trim()
      )
    })
    .join('\n')
}

// tree to terminal
const compiler = tree => {
  definitionsSingleton = utilFindDefinitions(tree)

  return nodeToTerm(tree)
}

module.exports = compiler
