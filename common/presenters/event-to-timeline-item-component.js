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
  const { id, occurred_at: timestamp, created_by: createdBy } = event
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

  return {
    id,
    ...getItem({
      containerClasses,
      labelClasses,
      heading,
      description,
      timestamp,
      byline: createdBy,
    }),
  }
}

module.exports = eventToTimelineItemComponent
