
function findFirst (candidate, current) {
  if (!candidate || current.start < candidate.start)
    return current
  return candidate
}

const getFirstDecorator = (node) =>
  node.decorators.reduce(findFirst, null)

const assignParent = node =>
  node.parent

const testParentType = type => node =>
  node.parent && (node.parent.type === type)

const testParentTypeBegins = type => node =>
  node.parent && node.parent.type.startsWith(type)


const parentTypeResolver = (type) => ({
  test:   testParentType(type),
  assign: assignParent
})

const returnResolver = parentTypeResolver('ReturnStatement')

const variableResolver = {
  test:   testParentType('VariableDeclaration'),
  assign: assignParent,
}

const variableDeclaratorResolver = {
  test:   testParentType('VariableDeclarator'),
  assign: assignParent,
}

const exportResolver = {
  test:   testParentTypeBegins('Export'),
  assign: assignParent,
}

const assignmentResolver = {

  assign: node => node.parent.left,
  test:   testParentType('AssignmentExpression'),
}

const callExpressionResolver = {

  assign: node => node.parent.parent,
  test:   testParentType('CallExpression'),
}

const arrowFunctionExpressionResolver = {
  test:   testParentType('ArrowFunctionExpression'),
  assign: assignParent,
}

const objectPropertyResolver = {
  test:   testParentType('Property'),
  assign: assignParent,
}

const switchCaseResolver = {
  test:   testParentType('SwitchCase'),
  assign: assignParent,
}

const decoratorResolver = {

  assign:   node => getFirstDecorator(node),

  test:     node => node.decorators && node.decorators.length,

  terminal: true,
}

module.exports = [
  decoratorResolver,
  variableDeclaratorResolver,
  variableResolver,
  exportResolver,
  assignmentResolver,
  callExpressionResolver,
  arrowFunctionExpressionResolver,
  objectPropertyResolver,
  returnResolver,
  switchCaseResolver,
]
