const { isEmpty } = require('lodash')
const pathToRegexp = require('path-to-regexp')
const querystring = require('qs')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const dateRegex = '[0-9]{4}-[0-9]{2}-[0-9]{2}'

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
  dateRegex,
  uuidRegex,
}
