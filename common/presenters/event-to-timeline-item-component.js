const eventHelpers = require('../helpers/events/event')
const setEventDetails = require('../helpers/events/set-event-details')

const getItem = ({
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

const eventToTimelineItemComponent = (moveEvent, move) => {
  const event = setEventDetails(moveEvent, move)

  const { id, occurred_at: timestamp } = event

  const flag = eventHelpers.getFlag(event)

  const containerClasses = eventHelpers.getContainerClasses(event)

  const headerClasses = eventHelpers.getHeaderClasses(event)

  const heading = eventHelpers.getHeading(event)

  const labelClasses = eventHelpers.getLabelClasses(event)

  const description = eventHelpers.getDescription(event)

  // TODO: when we have user info for event, update the following with something like
  // const byline = i18n.t('events::byline', details)
  const byline = ''

  return {
    id,
    flag,
    ...getItem({
      containerClasses,
      headerClasses,
      labelClasses,
      heading,
      description,
      timestamp,
      byline,
    }),
  }
}

module.exports = eventToTimelineItemComponent
