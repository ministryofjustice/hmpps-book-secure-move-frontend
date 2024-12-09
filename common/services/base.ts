import { isEmpty, isNil, isObject, isString, omitBy } from 'lodash'

import { ApiClient } from '../lib/api-client'
import { BasmRequest } from '../types/basm_request'

export class BaseService {
  req: Partial<BasmRequest>
  apiClient: ApiClient

  constructor(req: BaseService['req'] = {}) {
    this.req = req
    this.apiClient = (req && req.apiClient) || new ApiClient()
  }

  removeInvalid(input: any) {
    return omitBy(input, (v: any) =>
      isObject(v) || isString(v) ? isEmpty(v) : isNil(v)
    )
  }
}
