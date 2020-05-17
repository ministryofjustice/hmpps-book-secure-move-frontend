const { isEmpty } = require('lodash')
const pathToRegexp = require('path-to-regexp')
const querystring = require('qs')

function compileFromRoute(route, req = {}, overrides = {}) {
  const { baseUrl, path, query } = req
  const matched = pathToRegexp.match(route)(baseUrl + path)

  if (!matched) {
    return ''
  }

  const compileUrl = pathToRegexp.compile(route)
  const queryInUrl = !isEmpty(query) ? `?${querystring.stringify(query)}` : ''

  return compileUrl({ ...matched.params, ...overrides }) + queryInUrl
}

module.exports = {
  compileFromRoute,
}
