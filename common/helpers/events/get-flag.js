const i18n = require('../../../config/i18n').default

const getEventClassification = require('./get-event-classification')

const getFlag = event => {
  const classification = getEventClassification(event)

  if (!classification) {
    return
  }

  return {
    html: i18n.t(`events::classification.${classification}`),
    type: classification,
  }
}

module.exports = getFlag
