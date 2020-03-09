const i18n = require('../../config/i18n')
const { cloneDeep } = require('lodash')

function moveTypesToFilterComponent(item) {
  const moveType = cloneDeep(item)
  moveType.label = i18n.t(item.label)
  return moveType
}
module.exports = moveTypesToFilterComponent
