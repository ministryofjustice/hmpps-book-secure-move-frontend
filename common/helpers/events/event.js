const i18n = require('../../../config/i18n')

const getEventTypePrefix = event => {
  const { event_type: eventType } = event
  return `events::${eventType}`
}

const getEventClassification = event => {
  const { classification } = event
  return classification && classification !== 'default'
    ? classification
    : undefined
}

const getLabelClasses = event => {
  const eventTypePrefix = getEventTypePrefix(event)
  const statusChange = i18n.exists(`${eventTypePrefix}.statusChange`)
  return statusChange ? 'moj-badge' : undefined
}

const getContainerClasses = event => {
  return getEventClassification(event) ? 'app-panel' : ''
}

const getHeaderClasses = event => {
  const classification = getEventClassification(event)

  if (!classification) {
    return ''
  }

  let headerClasses = 'app-tag'

  if (classification === 'incident') {
    headerClasses += ' app-tag--destructive'
  }

  return headerClasses
}

const getHeading = event => {
  const eventTypePrefix = getEventTypePrefix(event)
  const { _index, details } = event
  let heading = i18n.t(`${eventTypePrefix}.heading`, details)

  if (_index) {
    heading += ` (${_index})`
  }

  return heading
}

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

const getDescription = event => {
  const eventTypePrefix = getEventTypePrefix(event)
  const { details } = event
  const description = i18n
    .t(`${eventTypePrefix}.description`, details)
    .replace(/^(\s*<br>)+/, '')
  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return description
}

module.exports = {
  getLabelClasses,
  getContainerClasses,
  getHeaderClasses,
  getHeading,
  getFlag,
  getDescription,
}
