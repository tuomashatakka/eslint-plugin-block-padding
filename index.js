
const message = `Too {{ term }} blank lines {{ direction }} the block. Expected {{ expected }}, got {{ actual }}.`

const options = [
  {
    type: "number",
    title: "Blank lines",
    default: 1,
  },
  {
    type: "object",
    title: "Options",
    properties: {
      strategy: {
        enum:  [ "exact", "at-most", "at-least" ],
        default: "exact",
      }
    }
  },
]

const meta = {
  schema: options,
  fixable: true }

const createRule = (selector, meta) => ({
  meta, create: createFor(selector, { meta }) })

const selector = (...sel) =>
  sel.join(', ')


module.exports = {
  rules: {
    'classes':            createRule('ClassDeclaration', meta),
    'methods':            createRule('MethodDefinition', meta),
    'functions':          createRule(
      selector(
        'FunctionDeclaration',
        ':not(MethodDefinition) > FunctionExpression',
        ':not(MethodDefinition) > ArrowFunctionExpression'),
      meta
    ),
    'variables':          createRule('VariableDeclaration', meta),
    'blocks':             createRule('BlockStatement', meta),
    'default-exports':    createRule('ExportDefaultDeclaration', meta),
    'exports':            createRule('ExportNamedDeclaration', meta),
  }
}

function getPadding (first, second) {  // eslint-disable-line max-statements
  if ([ first, second ].includes(null))
    return null

  const diff = Math.abs(first.loc.start.line - second.loc.end.line) - 1

  return Math.max(0, diff)
}


function findFirst (candidate, current) {
  if (!candidate || current.start < candidate.start)
    return current
  return candidate
}


const getFirstDecorator = (node) =>
  node.decorators.reduce(findFirst, null)


function resolveMainNode (original) {
  let node = Object.assign({}, original)

  if (node.decorators)
    return getFirstDecorator(node)

  if (node.parent.type.startsWith('Export'))
    node = node.parent
  if (node.parent.type === 'VariableDeclarator')
    node = node.parent
  if (node.parent.type === 'VariableDeclaration')
    node = node.parent
  if (node.parent.type === 'AssignmentExpression')
    node = node.parent.left
  return node
}


function resolveData (lines, requiredLines) {
  return {
    direction: 'before',
    expected:  requiredLines,
    actual:    lines,
    term:      lines > requiredLines ? 'many' : 'few'
  }
}


function createFor (selector, definition) {

  return function (context) {

    const options = {
      requiredLines: extract.call(definition, context.options),
      strategy:      extract.call(definition, context.options, 'strategy'),
    }

    // TODO
    // getFixFunction(options)
    const fix = () => () => null
    const compare = getComparatorFunction(options)

    function check (node) {

      node = resolveMainNode(node)

      const src      = context.getSourceCode()
      const opts     = { includeComments: true }
      const previous = src.getTokenBefore(node, opts)
      const start    = src.getFirstToken(node, opts)
      const lines    = getPadding.call(src, previous, start)

      // Is the node is first or last, lines gets null
      // as its value. We should ignore those cases.
      if (lines !== null && !compare(lines))
        context.report({
          message,
          node: start,
          data: resolveData(lines, options.requiredLines),
          fix:  fix(previous, start),
        })
    }

    return { [selector]: check }
  }
}


function getComparatorFunction (options) {
  switch (options.strategy) {

      case 'at-most':
        return (n) => n <= options.requiredLines
      case 'at-least':
        return (n) => n >= options.requiredLines
      default:
        return (n) => n === options.requiredLines

  }
}


function getFixFunction (options) {
  switch (options.strategy) {

      case 'at-most':
        return (before, start) => fixer => {

          // TODO
          // while (getPadding(before, start) > options.requiredLines)
          //   Remove a line
          fixer.remove(before)
        }

      case 'at-least':

        return  (before, start) => fixer => {
          while (getPadding(before, start) < options.requiredLines)
            fixer.insertTextBefore(start, "\n")
        }

      default:
        return (before, start) => fixer => {
          while (getPadding(before, start) < options.requiredLines)
            fixer.insertTextBefore(start, "\n")

          // TODO:
          // while (getPadding(before, start) > requiredLines)
          //   Remove a line
        }

  }
}


function extract (options, key = null) {
  if (key === null)
    return getPositionalArgument.call(this, options, 0)

  let opts = normalize.call(this, options)
  let val = key in opts
    ? opts[key]
    : null

  return val || opts[key].default
}


function getPositionalArgument (options, n) {
  return options instanceof Array && options.length > n
    ? options[n]
    : this.meta.schema[n].default
}


function normalize (options) {
  if (options instanceof Array)
    options = options[1]
  if (!options)
    return this.meta.schema[1].properties
  return options
}
