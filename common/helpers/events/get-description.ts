import i18n from '../../../config/i18n'
import * as formatters from '../../formatters'
import { TOptions } from 'i18next'

import {Event} from '../../types/event'

export function getDescription (event: Event) {
  const {
    event_type: eventType,
    details,
    supplier
  } = event
  details.vehicle_reg =
    details.vehicle_reg || details.journey?.vehicle?.registration

  populatePerCompletionUsers(details)

  if (supplier === null) {
    details.context = 'without_supplier'
  }

  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return i18n.t(`events::${eventType}.description`, details as TOptions).replace(/^(\s*<br>)+/, '')
}

const populatePerCompletionUsers = (details: any) => {
  if (!details.responded_by) {
    details.riskUsers = ''
    details.offenceUsers = ''
    details.healthUsers = ''
    details.propertyUsers = ''
    return
  }

  details.riskUsers = `by ${formatters.array(
    details.responded_by['risk-information']
  )}`
  details.offenceUsers = `by ${formatters.array(
    details.responded_by['offence-information']
  )}`
  details.healthUsers = `by ${formatters.array(
    details.responded_by['health-information']
  )}`
  details.propertyUsers = `by ${formatters.array(
    details.responded_by['property-information']
  )}`
}
