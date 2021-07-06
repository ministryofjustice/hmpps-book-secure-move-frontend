const Sentry = require('@sentry/node')
const { pick } = require('lodash')

const findUnpopulatedResources = require('./find-unpopulated-resources')

const populateResources = (obj, req, options, processed = []) => {
  const unpopulated = findUnpopulatedResources(obj, options).filter(
    resource => !processed.includes(resource)
  )

  if (!unpopulated.length) {
    const unprocessedError = new Error('Missing resource')
    const cleanedObj = obj.map(event => {
      return {
        ...pick(event, ['id', 'type', 'event_type', 'classification']),
        eventable: pick(event.eventable, ['id', 'type']),
      }
    })

    // TODO: Find way to deserialize missing resources properly
    if (processed.length > 1) {
      Sentry.withScope(scope => {
        scope.setLevel('warning')
        scope.setContext('Events', {
          'All events': JSON.stringify(cleanedObj),
          'Unpopulated resources': processed,
        })
        Sentry.captureException(unprocessedError)
      })
    }

    return
  }

  return populateResources(obj, req, options, unpopulated)
}

module.exports = populateResources
