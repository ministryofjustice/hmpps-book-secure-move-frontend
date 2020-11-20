const { find } = require('lodash')

function setComponent(components) {
  return (req, res, next, componentName) => {
    const component = find(components, { name: componentName })

    if (component) {
      req.component = component
      req.activeComponent = component.name
    }

    next()
  }
}

function setComponents(components = []) {
  return (req, res, next) => {
    req.components = components
    next()
  }
}

module.exports = {
  setComponent,
  setComponents,
}
