const { find } = require('lodash')

function appendResponseToField(responses = []) {
  return field => {
    const response = find(responses, ['question.key', field.name]) || {}

    if (!field.items) {
      return {
        ...field,
        response,
      }
    }

    const items = field.items.map(item => {
      if (!item.followup) {
        return item
      }

      const followup = item.followup.map(appendResponseToField(responses))

      return {
        ...item,
        followup,
      }
    })

    return {
      ...field,
      items,
      response,
    }
  }
}

module.exports = appendResponseToField
