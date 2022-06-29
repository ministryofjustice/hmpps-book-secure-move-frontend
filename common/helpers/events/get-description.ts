import i18n from '../../../config/i18n'
import * as formatters from '../../formatters'
import { TOptions } from 'i18next'

import { Event } from '../../types/event'
import { EventDetails } from '../../types/event-details'

const { getFullName } = require('../../services/user')

const FORMATTED_SECTIONS: { [key: string]: string } = {
  'health-information': 'Health information',
  'offence-information': 'Offence information',
  'property-information': 'Property information',
  'risk-information': 'Risk information'
}

export async function getDescription (token: string, event: Event) {
  const {
    event_type: eventType,
    details,
    supplier
  } = event
  details.vehicle_reg =
    details.vehicle_reg || details.journey?.vehicle?.registration

  if (eventType === 'PerCompletion') {
    await populatePerCompletion(token, details)
  }
  if (eventType === 'PerUpdated') {
    await populatePerUpdated(token, details)
  }

  if (supplier === null) {
    details.context = 'without_supplier'
  }

  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return i18n.t(`events::${eventType}.description`, details as TOptions).replace(/^(\s*<br>)+/, '')
}

const getCompletedBy = async (token: string, usernames?: Array<string | undefined>) => {
  if (!token || !usernames) {
    return ''
  }

  const fullNames = (await Promise.all(usernames.filter(u => u).map(u => getFullName(token, u)))).filter(n => n)
  if (!fullNames.length) {
    return ''
  }

  return `by ${formatters.array(fullNames)}`
}

const populatePerCompletion = async (token: string, details: EventDetails) => {
  if (!details.responded_by || typeof details.responded_by === 'string') {
    details.riskUsers = ''
    details.offenceUsers = ''
    details.healthUsers = ''
    details.propertyUsers = ''
    return
  }

  details.riskUsers = await getCompletedBy(token, details.responded_by['risk-information'])
  details.offenceUsers = await getCompletedBy(token, details.responded_by['offence-information'])
  details.healthUsers = await getCompletedBy(token, details.responded_by['health-information'])
  details.propertyUsers = await getCompletedBy(token, details.responded_by['property-information'])
}

const populatePerUpdated = async (token: string, details: EventDetails) => {
  if (!details.responded_by || typeof details.responded_by !== 'string') {
    details.updateAuthor = ''
  } else {
    const fullName = await getFullName(token, details.responded_by)
    details.updateAuthor = fullName ? `by ${fullName}` : ''
  }

  const section = FORMATTED_SECTIONS[details.section || '']
  details.updateSection = section ? `${section} updated` : 'Updated'
}
