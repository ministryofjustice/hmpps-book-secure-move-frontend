import { NextFunction } from 'express'
import { omit } from 'lodash'

import { Allocation } from '../../../../common/types/allocation'
import { BasmResponse } from '../../../../common/types/basm_response'
import { AllocationRequest } from '../edit/allocation-details'

import CreateAllocationBaseController from './base'

export default class SaveController extends CreateAllocationBaseController {
  async saveValues(
    req: AllocationRequest,
    _res: BasmResponse,
    next: NextFunction
  ) {
    try {
      const sessionModel = req.sessionModel.toJSON()
      const data = omit(sessionModel, ['csrf-secret', 'errors', 'errorValues'])

      const allocation = await req.services.allocation.create({
        ...data,
        requested_by: req.session.user.fullname,
      })

      req.sessionModel.set('allocation', allocation)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(
    req: AllocationRequest,
    res: BasmResponse,
    next: NextFunction
  ) {
    const { id } = req.sessionModel.get<Allocation>('allocation')

    try {
      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${id}/confirmation`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = SaveController
