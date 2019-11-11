
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
  node.parent && node.parent.type === type

const testParentTypeBegins = type => node =>
  node.parent && node.parent.type.startsWith(type)


const returnResolver = {
  name:   'Return resolver',
  test:   testParentType('ReturnStatement'),
  assign: assignParent
}

const variableResolver = {
  name:   'variableResolver',
  test:   testParentType('VariableDeclaration'),
  assign: assignParent,
}

const variableDeclaratorResolver = {
  name:   'variableDeclaratorResolver',
  test:   testParentType('VariableDeclarator'),
  assign: assignParent,
}

const exportResolver = {
  name:   'exportResolver',
  test:   testParentTypeBegins('Export'),
  assign: assignParent,
}

const assignmentResolver = {
  name:   'assignmentResolver',
  test:   testParentType('AssignmentExpression'),
  assign: node => node.parent.left,
}

const callExpressionResolver = {
  name:   'callExpressionResolver',
  test:   testParentType('CallExpression'),
  assign: node => node.parent.parent,
}

const arrowFunctionExpressionResolver = {
  name:   'arrowFunctionExpressionResolver',
  test:   testParentType('ArrowFunctionExpression'),
  assign: assignParent,
}

const objectPropertyResolver = {
  name:   'objectPropertyResolver',
  test:   testParentType('Property'),
  assign: assignParent,
}

const switchCaseResolver = {
  name:   'switchCaseResolver',
  test:   testParentType('SwitchCase'),
  assign: assignParent,
}

const decoratorResolver = {
  name:     'decoratorResolver',
  terminal: true,
  assign:   node => getFirstDecorator(node),
  test:     node => node.decorators && node.decorators.length,
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
