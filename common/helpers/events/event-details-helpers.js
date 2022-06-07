const pluralize = require('pluralize')

const i18n = require('../../../config/i18n').default
const { event: eventModel } = require('../../lib/api-client/models')

const eventRelationships = Object.keys(eventModel.fields).filter(field => {
  return typeof eventModel.fields[field] === 'object'
})

// add resources that belong to move and are common to all events
// NB. move.supplier will exist even when event.supplier does not
const getMoveDetails = move => ({
  move,
  person: move.profile?.person || {},
})

// if an event has a supplier, the supplier was the agent
// if not, check the locales for a default agent
// finally, use PMU as default agent
const getEventAgency = event => {
  let agency = event.supplier ? 'supplier' : undefined

  if (!agency) {
    const defaultAgencyKey = `events::${event.event_type}.default_agency`
    agency = i18n.exists(defaultAgencyKey)
      ? i18n.t(defaultAgencyKey)
      : i18n.t('events::default_agency')
  }

  return { agency }
}

// add context (if any) to event
const getEventContext = event => {
  const contextKeyDefinition = `events::${event.event_type}.contextKey`

  const contextKey = i18n.exists(contextKeyDefinition)
    ? i18n.t(contextKeyDefinition)
    : undefined

  const context = event.details?.[contextKey]
  return { context }
}

// add event relationships
const getEventRelationships = event => {
  return eventRelationships.reduce((acc, rel) => {
    if (event[rel]) {
      acc[rel] = event[rel]
    }

    return acc
  }, {})
}

// add eventable resources to details object
// eg event.eventable.type === 'journeys'
// => event.details.journey
const getEventableDetails = event => {
  const details = {}

  if (event.eventable && event.eventable.type) {
    details[pluralize.singular(event.eventable.type)] = event.eventable
  }

  return details
}

// add standard common properties of the event itself
const getEventProperties = event => {
  // eslint-disable-next-line camelcase
  const { notes, occurred_at, created_by } = event
  return {
    notes,
    occurred_at,
    created_by,
  }
}

module.exports = {
  getMoveDetails,
  getEventAgency,
  getEventContext,
  getEventRelationships,
  getEventableDetails,
  getEventProperties,
}
