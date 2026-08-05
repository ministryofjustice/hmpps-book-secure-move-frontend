import { isEmpty } from 'lodash'
import { compile, match, pathToRegexp, Key, MatchFunction } from 'path-to-regexp'

import { getQueryString } from'../lib/request'
import { URLRequest } from '../types/url_request'

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const dateRegex = '[0-9]{4}-[0-9]{2}-[0-9]{2}'

/**
 * Express 5's router resolves paths via path-to-regexp v8, which dropped
 * support for `:name(pattern)` custom constraints. This compiles a v6-style
 * route string (still using the direct path-to-regexp@6 dependency above)
 * into a RegExp with named capture groups, which router's Layer matches
 * natively (bypassing the v8 string parser). Use at the point a path is
 * handed to Express (router.get/use etc), not on the route constant itself.
 */
function toRoutePattern(
  path: string,
  options: { end?: boolean; sensitive?: boolean; strict?: boolean } = {}
): string | RegExp {
  if (!path.includes('(')) {
    return path
  }

  const keys: Key[] = []
  const regexp = pathToRegexp(path, keys, options)
  let index = 0

  const source = regexp.source.replace(/\((?!\?)/g, () => {
    const key = keys[index++]
    return key && typeof key.name === 'string' ? `(?<${key.name}>` : '('
  })

  return new RegExp(source, regexp.flags)
}

function compileFromRoute(
  route: string,
  req: URLRequest = { baseUrl: '', path: '', query: {}, params: {} },
  overrides: Record<string, string | undefined> = {},
  queryOverrides: Record<string, string | undefined> = {}
) {
  const { baseUrl = '', path = '', query = {}, params = {} } = req

  const combinedQuery = {
    ...query,
    ...queryOverrides,
  }

  const matchFunction: MatchFunction = match(route)
  const matched = matchFunction(baseUrl + path)

  if (!matched) {
    return ''
  }

  const compileUrl = compile(route)
  const queryInUrl = !isEmpty(combinedQuery) ? getQueryString(combinedQuery, {}) : ''

  return compileUrl({ ...matched.params, ...overrides }) + queryInUrl
}

export {
  compileFromRoute,
  dateRegex,
  toRoutePattern,
  uuidRegex,
}
