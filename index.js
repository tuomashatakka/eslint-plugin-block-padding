
const message =
  `Too {{ term }} blank lines {{ direction }} the block. ` +
  `Expected to have {{ expected }} blank lines, found {{ actual }}.`

const classDefinitionsSelector = 'ClassDeclaration'

const classDefinitionsRule = {
  meta: {
    fixable: true,
    schema: [
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
  },

  create: function (context) {

    let compare
    const requiredLines = extract.call(classDefinitionsRule, context.options)
    const strategy      = extract.call(classDefinitionsRule, context.options, 'strategy')
    const src           = context.getSourceCode()

    const getPadding = (first, second) => [ first, second ].indexOf(null) > -1 ? null :
      Math.abs(second.loc.start.line - first.loc.end.line) - 1

    switch (strategy) {

    case 'exact':
      compare = (n) => n === requiredLines
      break
    case 'at-most':
      compare = (n) => n <= requiredLines
      break
    case 'at-least':
      compare = (n) => n >= requiredLines

    }

    const fix = node => fixer =>
      fixer.insertTextBefore(node, "\n")

    function check (node) {
      const opts = { includeComments: false }
      const before = src.getTokenBefore(node, opts)
      const start = src.getFirstToken(node, opts)
      const lines = getPadding(before, start)

      if (typeof lines === 'number' &&  !compare(lines))
        context.report({
          fix: fix(node),
          node,
          loc: {
            start: before.loc.end,
            end: start.loc.start,
          },
          message,
          data: {
            direction: 'before',
            expected:  requiredLines,
            actual:    lines,
            term:      lines > requiredLines ? 'many' : 'few'
          }
        })
    }

    return {
      [classDefinitionsSelector]: check
    }
  }
}

module.exports = {
  rules: {
    'class-definitions': classDefinitionsRule,
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
