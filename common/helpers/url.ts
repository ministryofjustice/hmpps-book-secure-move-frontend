import { isEmpty } from 'lodash'
import { compile, match, MatchFunction } from 'path-to-regexp'

import { getQueryString } from'../lib/request'
import { URLRequest } from '../types/url_request'

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const dateRegex = '[0-9]{4}-[0-9]{2}-[0-9]{2}'

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
  uuidRegex,
}
