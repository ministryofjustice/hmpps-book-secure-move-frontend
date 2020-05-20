const { pickBy } = require('lodash')

const i18n = require('../../../config/i18n')

function objectToTableHead(schemaEl) {
  const { head } = schemaEl
  const prop = head.html ? 'html' : 'text'
  return pickBy({
    ...head,
    [prop]: i18n.t(schemaEl.head[prop]),
  })
}
module.exports = objectToTableHead
