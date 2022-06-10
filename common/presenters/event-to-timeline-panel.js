const filters = require('../../config/nunjucks/filters')
const eventHelpers = require('../helpers/events')

const eventToTagComponent = require('./event-to-tag-component')

module.exports = async (token, moveEvent, move) => {
  const event = eventHelpers.setEventDetails(moveEvent, move)
  const { id, occurred_at: timestamp } = event
  const description = await eventHelpers.getDescription(token, event)

  const tag = eventToTagComponent(event)
  delete tag.href

  const formattedDate = filters.formatDateWithTimeAndDay(timestamp)

  const html = `
    <div class="app-timeline__description">${description}</div>
    <div class="app-timeline__date">
      <time datetime="${timestamp}">${formattedDate}</time>
    </div>
  `

  return {
    tag,
    html,
    isFocusable: true,
    attributes: { id },
  }
}
