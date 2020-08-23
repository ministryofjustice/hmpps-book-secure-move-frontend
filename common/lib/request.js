const queryString = require('query-string')

function getQueryString(target, source) {
  const output = queryString.stringify({ ...target, ...source })
  return output ? `?${output}` : ''
}

function getUrl(page, args = {}) {
  return `${page}${getQueryString(args)}`
}

module.exports = {
  getQueryString,
  getUrl,
}
