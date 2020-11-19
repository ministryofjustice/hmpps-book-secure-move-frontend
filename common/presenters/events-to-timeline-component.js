const i18n = require('../../config/i18n')
const addTriggeredEvents = require('../helpers/events/add-triggered-events')
const setEventDetails = require('../helpers/events/set-event-details')

const getItem = ({
  itemClasses,
  headerClasses,
  containerClasses,
  labelClasses,
  heading,
  description,
  timestamp,
  byline,
}) => {
  return {
    container: {
      classes: containerClasses,
    },
    header: {
      classes: headerClasses,
    },
    label: {
      classes: labelClasses,
      html: heading,
    },
    classes: itemClasses,
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

const getLabelClasses = eventTypePrefix => {
  const statusChange = i18n.exists(`${eventTypePrefix}.statusChange`)
  return statusChange ? 'moj-badge' : undefined
}

const getFlagClasses = eventTypePrefix => {
  let containerClasses
  let headerClasses
  const hasFlag = i18n.exists(`${eventTypePrefix}.flag`)

  if (hasFlag) {
    const flag = i18n.t(`${eventTypePrefix}.flag`)
    containerClasses = 'app-panel'
    headerClasses = 'app-tag'

    if (flag === 'red') {
      headerClasses += ' app-tag--destructive'
    }
  }

  return {
    containerClasses,
    headerClasses,
  }
}

const eventsToTimelineComponent = (move = {}) => {
  const { timeline_events: moveEvents } = move

  const items = addTriggeredEvents(moveEvents).map(moveEvent => {
    const event = setEventDetails(moveEvent, move)

    const { details, event_type: eventType } = event
    const eventTypePrefix = `events::${eventType}`

    const labelClasses = getLabelClasses(eventTypePrefix)

    const flagClasses = getFlagClasses(eventTypePrefix)

    const heading = i18n.t(`${eventTypePrefix}.heading`, details)
    const description = i18n
      .t(`${eventTypePrefix}.description`, details)
      .replace(/^<br>/, '')
    // Some strings that get added together are prefixed with a <br>.
    // This enables them to be used as the first item or where a previous string doesn't get output
    // and not insert additional space without having to make the <br> conditional

    // TODO: when we have user info for event, update the following with something like
    // const byline = i18n.t('events::byline', details)
    const byline = ''

    const timestamp = event.occurred_at

    return getItem({
      ...flagClasses,
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
