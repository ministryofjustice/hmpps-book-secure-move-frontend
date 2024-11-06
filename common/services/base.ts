import { isEmpty, isNil, isObject, isString, omitBy } from 'lodash'

// @ts-ignore // TODO: convert to TS
import ApiClient from '../lib/api-client'

export class BaseService {
  req: any
  apiClient: any // TODO: convert ApiClient to TS

  constructor(req: any = {}) {
    this.req = req
    this.apiClient = (req && req.apiClient) || new ApiClient()
  }

  removeInvalid(input: any) {
    return omitBy(input, (v: any) =>
      isObject(v) || isString(v) ? isEmpty(v) : isNil(v)
    )
  }
}
