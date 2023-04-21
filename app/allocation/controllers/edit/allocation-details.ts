import UpdateBaseController from './base'
import { BasmRequest } from '../../../../common/types/basm_request'
import { BasmResponse } from '../../../../common/types/basm_response'

const filters = require('../../../../config/nunjucks/filters')

const presenters = require('../../../../common/presenters')

type FormValues = { date?: string }
type AllocationRequest = Required<Pick<BasmRequest, 'allocation' | 'form' | 'services' | 'session' | 'sessionModel'>>

class AllocationDetailsController extends UpdateBaseController {

  getValues(req: AllocationRequest, res: BasmResponse, callback: (err: any, values?: FormValues) => void) {
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

      const allocation = await req.services.allocation.update({ id: id, date: date })

      req.sessionModel.set('allocation', allocation)
      next()
    } catch (err) {
      next(err)
    }
  }

  render(req: AllocationRequest, res: BasmResponse, next: () => void) {
    super.render(req, res, next)

    // Discard the session model once we've rendered the error messages.
    // We don't want the errors to hang around in the session after the user has been informed.
    req.sessionModel.reset()
    req.session.save()
  }
}

export { AllocationRequest }

export default AllocationDetailsController
