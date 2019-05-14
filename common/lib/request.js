const queryString = require('query-string')

module.exports = {
  getQueryString (target, source) {
    const merged = Object.assign({}, target, source)
    return `?${queryString.stringify(merged)}`
  },
}
