const i18n = require('../../../config/i18n').default

const getHeading = event => {
  const { event_type: eventType, _index, details, supplier } = event

  if (supplier === null) {
    details.context = 'without_supplier'
  }

  let heading = i18n.t(`events::${eventType}.heading`, details)

  if (_index) {
    heading += ` (${_index})`
  }

  return heading
}

module.exports = getHeading
