const { find, get } = require('lodash')

function removeEmptyItems (items, paths) {
  return items.filter((item) => {
    let include = false

    paths.forEach((path) => {
      if (get(item, path)) {
        include = true
      }
    })

    return include
  })
}

function getIdentifier (identifiers, type) {
  const identifier = find(identifiers, { identifier_type: type })
  return get(identifier, 'value')
}

module.exports = {
  removeEmptyItems,
  getIdentifier,
}
