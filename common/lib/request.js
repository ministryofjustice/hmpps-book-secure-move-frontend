const queryString = require('query-string')

function getQueryString(target, source) {
  return `?${queryString.stringify({ ...target, ...source })}`
}

module.exports = {
  getQueryString,
}
