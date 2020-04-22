const { get, isFunction } = require('lodash')
function objectToTableRow(schema) {
  return function(data) {
    return schema.map(schemaProp => {
      let html
      const prop = schemaProp.row
      if (isFunction(prop)) {
        html = prop(data)
      } else if (Array.isArray(prop)) {
        html = prop
          .map(singleProp => {
            return get(data, singleProp)
          })
          .join(' ')
      } else {
        html = get(data, prop)
      }
      return {
        html,
        ...schemaProp.attributes,
      }
    })
  }
}
module.exports = objectToTableRow
