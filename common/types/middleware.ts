import { NextFunction } from 'express'

import { BasmRequest } from './basm_request'
import { BasmResponse } from './basm_response'

export type Middleware = (
  req: BasmRequest,
  res: BasmResponse,
  next?: NextFunction
) => void
