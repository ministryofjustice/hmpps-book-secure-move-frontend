import UpdateBaseController from './base'
import { BasmRequest } from '../../../../common/types/basm_request'
import { BasmResponse } from '../../../../common/types/basm_response'

const presenters = require('../../../../common/presenters')

type FormValues = { date?: string }
type AllocationRequest = Required<Pick<BasmRequest, 'allocation' | 'form' | 'services' | 'sessionModel'>>

class AllocationDetailsController extends UpdateBaseController {

  getValues(req: AllocationRequest, res: BasmResponse, callback: (err: any, values?: FormValues) => void) {
    return super.getValues(req, res, (err: any, values: FormValues) => {
      if (err) {
        return callback(err)
      }

      if (!values.date) {
        values.date = req.allocation.date
      }

      callback(null, values)
    })
  }

  getReturnUrl(req: AllocationRequest) {
    return `/allocation/${req.allocation.id}`
  }

  configure(req: AllocationRequest, _res: BasmResponse, next: () => any) {
    req.form.options.next = this.getReturnUrl(req)
    next()
  }

  locals(req: AllocationRequest, _res: BasmResponse, callback: (err: any, locals?: object) => any) {
    const locals = {
      cancelUrl: this.getReturnUrl(req),
      summary: presenters.allocationToMetaListComponent(req.allocation)
    }
    callback(null, locals)
  }

  async saveValues(req: AllocationRequest, _res: BasmResponse, next: (err?: any) => any) {
    try {
      const id = req.allocation.id
      const date = req.form.values.date

      await req.services.allocation.update({ id: id, date: date })

      next()
    } catch (err) {
      next(err)
    }
  }
}

export { AllocationRequest }

export default AllocationDetailsController
