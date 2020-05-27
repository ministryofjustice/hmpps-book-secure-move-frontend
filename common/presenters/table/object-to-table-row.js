const { get, isFunction, pickBy } = require('lodash')

function objectToTableRow(schema) {
  return function(data) {
    return schema
      .map(({ head, row }) => {
        if (!head) {
          return undefined
        }

        const prop = row.html || row.text
        let content

        if (isFunction(prop)) {
          content = prop(data)
        } else if (Array.isArray(prop)) {
          content = prop.map(singleProp => get(data, singleProp)).join(' ')
        } else {
          content = get(data, prop)
        }

        return pickBy({
          ...row,
          html: row.html ? content : undefined,
          text: row.text ? content : undefined,
        })
      })
      .filter(row => row)
  }
}
module.exports = objectToTableRow
