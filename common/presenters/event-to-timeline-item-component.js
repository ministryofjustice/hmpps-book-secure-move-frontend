const eventHelpers = require('../helpers/events')
const componentService = require('../services/component')

const getItem = ({
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
  const event = eventHelpers.setEventDetails(moveEvent, move)
  const { id, occurred_at: timestamp } = event
  const flag = eventHelpers.getFlag(event)
  const containerClasses = eventHelpers.getContainerClasses(event)
  let heading = eventHelpers.getHeading(event)
  const labelClasses = eventHelpers.getLabelClasses(event)
  const description = eventHelpers.getDescription(event)

  if (flag) {
    const headerClasses = eventHelpers.getHeaderClasses(event)
    heading = componentService.getComponent('appTag', {
      html: heading,
      flag,
      classes: headerClasses,
    })
  }

  // TODO: when we have user info for event, update the following with something like
  // const byline = i18n.t('events::byline', details)
  const byline = ''

  return {
    id,
    ...getItem({
      containerClasses,
      labelClasses,
      heading,
      description,
      timestamp,
      byline,
    }),
  }
}

module.exports = eventToTimelineItemComponent
