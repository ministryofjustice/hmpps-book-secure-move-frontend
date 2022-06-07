const i18n = require('../../../config/i18n').default

const getLabelClasses = event => {
  const { event_type: eventType } = event
  const statusChange = i18n.exists(`events::${eventType}.statusChange`)
  return statusChange ? 'moj-badge' : undefined
}

module.exports = getLabelClasses
