import { TOptions } from 'i18next'

import i18n from '../../../config/i18n'
import * as formatters from '../../formatters'
import { EventDetails } from '../../types/event-details'
import { GenericEvent } from '../../types/generic_event'

const { formatDate } = require('../../../config/nunjucks/filters')
const { getFullName } = require('../../services/user')

const FORMATTED_SECTIONS: { [key: string]: string } = {
  'health-information': 'Health information',
  'offence-information': 'Offence information',
  'property-information': 'Property information',
  'risk-information': 'Risk information',
}

export async function getDescription(token: string, event: GenericEvent) {
  const { event_type: eventType, details, supplier } = event

  details.vehicle_reg =
    details.vehicle_reg || details.journey?.vehicle?.registration

  if (eventType === 'PerCompletion') {
    await populatePerCompletion(token, details)
  } else if (eventType === 'PerUpdated') {
    await populatePerUpdated(token, details)
  } else if (eventType === 'LodgingCreate' || eventType === 'LodgingCancel') {
    const startDate = new Date(details.start_date || '')
    const endDate = new Date(details.end_date || '')
    startDate.setDate(startDate.getDate() + 1)
    const dateFormat = 'yyyy-MM-dd'

    if (formatDate(startDate, dateFormat) !== formatDate(endDate, dateFormat)) {
      details.context = 'long'
    }
  } else if (eventType === 'LodgingUpdate') {
    const changedFieds = []

    if (
      details.old_start_date &&
      details.start_date !== details.old_start_date
    ) {
      changedFieds.push('start_date')
    }

    if (details.old_end_date && details.end_date !== details.old_end_date) {
      changedFieds.push('end_date')
    }

    if (details.old_location && details.location !== details.old_location) {
      changedFieds.push('location')
    }

    details.context = changedFieds.join('_and_')
  } 
  else if (supplier === null) {
    details.context = 'without_supplier'
  }

  // Some strings that get added together are prefixed with a <br>.
  // This enables them to be used as the first item or where a previous string doesn't get output
  // and not insert additional space without having to make the <br> conditional
  return i18n
    .t(`events::${eventType}.description`, details as TOptions)
    .replace(/^(\s*<br>)+/, '');
}

const getCompletedBy = async (
  token: string,
  usernames?: Array<string | undefined>
) => {
  if (!token || !usernames) {
    return ''
  }

  const fullNames = (
    await Promise.all(usernames.filter(u => u).map(u => getFullName(token, u)))
  ).filter(n => n)

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

  details.riskUsers = await getCompletedBy(
    token,
    details.responded_by['risk-information']
  )
  details.offenceUsers = await getCompletedBy(
    token,
    details.responded_by['offence-information']
  )
  details.healthUsers = await getCompletedBy(
    token,
    details.responded_by['health-information']
  )
  details.propertyUsers = await getCompletedBy(
    token,
    details.responded_by['property-information']
  )
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
