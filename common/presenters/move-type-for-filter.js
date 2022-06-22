const i18n = require('../../config/i18n').default

function moveTypesToFilterComponent(item) {
  item.label = i18n.t(item.label).toLowerCase()
  return item
}

module.exports = moveTypesToFilterComponent
