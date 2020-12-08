const eventHelpers = require('../helpers/events')

const eventToTagComponent = (event, moveId) => {
  const { id } = event

  const html = eventHelpers.getHeading(event)

  const flag = eventHelpers.getFlag(event)

  const classes = eventHelpers.getHeaderClasses(event)

  const href = `/move/${moveId}/timeline#${id}`

  return {
    id,
    href,
    flag,
    html,
    classes,
  }
}

module.exports = eventToTagComponent
