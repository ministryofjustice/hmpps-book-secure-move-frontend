import { NextFunction, Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { compile, match } from 'path-to-regexp'

import { getQueryString } from'../lib/request'
import { BasmError } from '../types/basm_error'
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

  const matchFunction = match(route)
  const matched = matchFunction(baseUrl + path)

  if (!matched) {
    return ''
  }

  const compileUrl = compile(route)
  const queryInUrl = !isEmpty(combinedQuery) ? getQueryString(combinedQuery, {}) : ''

  return compileUrl({ ...matched.params, ...overrides }) + queryInUrl
}

// Express 5's path-to-regexp no longer supports inline regex/alternation in
// route params (e.g. `:id(${uuidRegex})`), so params are matched loosely by
// Express and validated here instead. An absent (optional) param is treated
// as valid; an invalid value 404s the same way an unmatched route used to.
function matchParam(paramName: string, pattern: string | string[]) {
  const values = Array.isArray(pattern) ? pattern : undefined
  const regex = values ? undefined : new RegExp(`^(?:${pattern})$`)

  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[paramName]
    const isValid =
      value === undefined ||
      (typeof value === 'string' &&
        (values ? values.includes(value) : regex!.test(value)))

    if (isValid) {
      return next()
    }

    const error = new Error('Not Found') as BasmError
    error.statusCode = 404
    next(error)
  }
}

export {
  compileFromRoute,
  dateRegex,
  matchParam,
  uuidRegex,
}
