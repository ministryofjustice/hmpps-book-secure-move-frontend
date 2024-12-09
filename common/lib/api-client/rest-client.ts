import axios from 'axios'

import { API } from '../../../config'
import { BasmRequest } from '../../types/basm_request'

import getRequestHeaders from './request-headers'

const auth = require('./auth')()
type RestResponse<
  ResponseTypeString extends string,
  ResponseType extends object,
> = Promise<{
  data: {
    id: string
    type: ResponseTypeString
    attributes: ResponseType
    relationships?: {
      [type: string]: {
        data: {
          id: string
          type: string
        }[]
      }
    }
  }[]
  links: {
    self: string
    first: string
    prev: string | null
    next: string | null
    last: string
  }
}>

export default async function restClient<
  ResponseTypeString extends string,
  ResponseType extends object,
>(
  req: BasmRequest,
  url: string,
  args: object,
  options: {
    format?: string
    method?: 'get' | 'post'
    data?: object
    params?: object
  } = {}
): RestResponse<ResponseTypeString, ResponseType> {
  const authorizationHeader = await auth.getAuthorizationHeader()
  const requestHeaders = getRequestHeaders(req, options.format)
  const headers = {
    ...authorizationHeader,
    ...requestHeaders,
  }
  const argsType = options.method === 'post' ? 'data' : 'params'

  if (args && options[argsType] === undefined) {
    options[argsType] = args
  }

  const response = (await axios(`${API.BASE_URL}${url}`, {
    ...options,
    headers,
  })) as { data: Awaited<RestResponse<ResponseTypeString, ResponseType>> }
  return response.data
}

restClient.get = restClient

restClient.post = (
  req: BasmRequest,
  url: string,
  data: object,
  options: object
) => restClient(req, url, data, { ...options, method: 'post' })
