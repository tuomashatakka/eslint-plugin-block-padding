/* eslint block-padding/functions: [ 1, 2 ] */
const resolvers = require('./resolvers')
const meta      = require('./options')

const message = `Too {{ term }} blank lines {{ direction }} the block. Expected {{ expected }}, got {{ actual }}.`


const createRule = (selector, meta) => ({
  meta,
  create: createFor(selector, { meta })
})


const selector = (...sel) =>
  sel.join(', ')

const FUNCTION_SELECTOR = selector(
  'FunctionDeclaration',
  ':not(MethodDefinition) > FunctionExpression'
)

const ARROW_FUNCTION_SELECTOR = ':not(MethodDefinition) > ArrowFunctionExpression'

module.exports = {
  rules: {
    'classes':            createRule('ClassDeclaration', meta),
    'methods':            createRule('MethodDefinition', meta),
    'functions':          createRule(FUNCTION_SELECTOR, meta),
    'arrow-functions':    createRule(ARROW_FUNCTION_SELECTOR, meta),
    'variables':          createRule('VariableDeclaration', meta),
    'blocks':             createRule('BlockStatement', meta),
    'default-exports':    createRule('ExportDefaultDeclaration', meta),
    'exports':            createRule('ExportNamedDeclaration', meta),
  }
}


function createFor (selector, definition) {


  return function (context) {

    const options = {
      requiredLines: extract.call(definition, context.options),
      strategy:      extract.call(definition, context.options, 'strategy'),
    }


    const fix = () => getFixFunction(options)
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


function getPadding (first, second) {  // eslint-disable-line max-statements
  if ([ first, second ].includes(null))
    return null
  const diff = Math.abs(first.loc.start.line - second.loc.end.line) - 1
  return Math.max(0, diff)
}


function resolveMainNode (original) {  // eslint-disable-line complexity
  let node = Object.assign({}, original)

  let resolver = null
  const localResolvers = [ ...resolvers ]
  while (resolver = localResolvers.shift())
    if (resolver.test(node)) {
      node = resolver.assign(node)
      if (resolver.terminal)
        return node
    }
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


  return () => null

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
