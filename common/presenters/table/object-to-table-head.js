const i18n = require('../../../config/i18n')

function objectToTableHead(schemaEl) {
  return {
    html: i18n.t(schemaEl.head),
  }
}
module.exports = objectToTableHead
