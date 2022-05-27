const i18n = require('../../../config/i18n')

const getDescription = event => {
  const { event_type: eventType, details, supplier } = event
  details.vehicle_reg =
    details.vehicle_reg || details.journey?.vehicle?.registration

  populatePerCompletionUsers(details)

  if (supplier === null) {
    details.context = 'without_supplier'
  }

  const description = i18n
    .t(`events::${eventType}.description`, details)
    .replace(/^(\s*<br>)+/, '')

  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return description
}

const populatePerCompletionUsers = details => {
  if (!details.responded_by) {
    details.riskUsers = ''
    details.offenceUsers = ''
    details.healthUsers = ''
    details.propertyUsers = ''
    return
  }

  details.riskUsers = `by ${formatArray(
    details.responded_by['risk-information']
  )}`
  details.offenceUsers = `by ${formatArray(
    details.responded_by['offence-information']
  )}`
  details.healthUsers = `by ${formatArray(
    details.responded_by['health-information']
  )}`
  details.propertyUsers = `by ${formatArray(
    details.responded_by['property-information']
  )}`
}

const formatArray = array =>
  array
    .filter(i => i)
    .sort()
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1')

module.exports = getDescription
