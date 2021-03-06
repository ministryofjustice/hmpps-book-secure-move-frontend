const i18n = require('../../../config/i18n')

const getDescription = event => {
  const { event_type: eventType, details } = event
  const description = i18n
    .t(`events::${eventType}.description`, details)
    .replace(/^(\s*<br>)+/, '')
  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return description
}

module.exports = getDescription
