const i18n = require('../../config/i18n')
const addTriggeredEvents = require('../helpers/events/add-triggered-events')
const setEventDetails = require('../helpers/events/set-event-details')

const getItem = ({
  component,
  labelClasses,
  heading,
  description,
  timestamp,
  byline,
}) => {
  return {
    label: {
      classes: labelClasses,
      html: heading,
    },
    classes: 'app-timeline__item',
    html: description,
    datetime: {
      timestamp,
      type: 'datetime',
    },
    byline: {
      html: byline,
    },
  }
}

const eventsToTimelineComponent = (move = {}) => {
  const { timeline_events: moveEvents } = move

  const items = addTriggeredEvents(moveEvents).map(moveEvent => {
    const event = setEventDetails(moveEvent, move)

    const { details, event_type: eventType } = event
    const statusChange = i18n.exists(`events::${eventType}.statusChange`)
    const labelClasses = statusChange ? 'moj-badge' : undefined

    const heading = i18n.t(`events::${eventType}.heading`, details)
    const description = i18n
      .t(`events::${eventType}.description`, details)
      .replace(/^<br>/, '')
    // Some strings that get added together are prefixed with a <br>.
    // This enables them to be used as the first item or where a previous string doesn't get output
    // and not insert additional space without having to make the <br> conditional

    // TODO: when we have user info for event, update the following with something like
    // const byline = i18n.t('events::byline', details)
    const byline = ''

    const timestamp = event.occurred_at

    return getItem({
      labelClasses,
      heading,
      description,
      timestamp,
      byline,
    })
  })
  return { items }
}

module.exports = eventsToTimelineComponent
