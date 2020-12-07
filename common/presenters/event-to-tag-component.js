const eventHelpers = require('../helpers/events/event')
const componentService = require('../services/component')

const eventToTagComponent = (event, moveId) => {
  const { id } = event

  const heading = eventHelpers.getHeading(event)

  const flag = {
    ...eventHelpers.getFlag(event),
    html: heading,
  }

  const html = componentService.getComponent('appFlag', flag)

  const classes = eventHelpers.getHeaderClasses(event)

  const href = `/move/${moveId}/timeline#${id}`

  return {
    id,
    href,
    html,
    classes,
  }
}

module.exports = eventToTagComponent
