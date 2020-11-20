const { find } = require('lodash')

function renderComponent(req, res) {
  res.render('components/views/component', {
    components: req.components,
    component: req.component,
    activeComponent: req.activeComponent,
  })
}

function renderRawExample(req, res) {
  const component = req.component
  const example = find(component.config?.examples, {
    name: req.params.example,
  })

  res.render('components/views/example', {
    example,
    component,
  })
}

function renderList(req, res) {
  res.render('components/views/list', {
    components: req.components,
  })
}

module.exports = {
  renderComponent,
  renderRawExample,
  renderList,
}
