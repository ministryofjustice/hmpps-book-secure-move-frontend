import { BasmResponse } from '../../../../common/types/basm_response'

import UpdateBaseController, { AllocationRequest } from './base'

const filters = require('../../../../config/nunjucks/filters')

type FormValues = { date?: string }


class AllocationDateController extends UpdateBaseController {

  setContext(){

  }
  getValues(
    req: AllocationRequest,
    res: BasmResponse,
    callback: (err: any, values?: FormValues) => void
  ) {
    return super.getValues(req, res, (err: any, values: FormValues) => {
      if (err) {
        return callback(err)
      }

      const { date } = req.allocation

      if (!date) {
        values.date = req.allocation.date
      }

      values.date = filters.formatDateAsRelativeDay(date)

      callback(null, values)
    })
  }

  async saveValues(
    req: AllocationRequest,
    _res: BasmResponse,
    next: (err?: any) => any
  ) {
    try {
      const date = req.form.values.date

      console.log(date)

      req.sessionModel.set('proposedDate', date)

      next()
    } catch (err) {
      next(err)
    }
  }

  render(req: AllocationRequest, res: BasmResponse, next: () => void) {
    super.render(req, res, next)
  }
}

export default AllocationDateController
