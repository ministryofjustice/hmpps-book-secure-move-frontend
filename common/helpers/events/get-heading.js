const i18n = require('../../../config/i18n')

const getHeading = event => {
  const { event_type: eventType, _index, details, supplier } = event
  let heading

  if (supplier === null) {
    details.context = 'without_supplier'
  }

  heading = i18n.t(`events::${eventType}.heading`, details)

  if (_index) {
    heading += ` (${_index})`
  }

  return heading
}

module.exports = getHeading
