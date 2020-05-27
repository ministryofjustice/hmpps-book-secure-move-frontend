const { pickBy } = require('lodash')

const i18n = require('../../../config/i18n')

function objectToTableHead({ head } = {}) {
  if (!head) {
    return undefined
  }

  return pickBy({
    ...head,
    html: head.html ? i18n.t(head.html) : undefined,
    text: head.text ? i18n.t(head.text) : undefined,
  })
}

module.exports = objectToTableHead
