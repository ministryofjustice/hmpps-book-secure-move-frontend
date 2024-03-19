import { BasmRequest } from '../../../../common/types/basm_request'
import { BasmResponse } from '../../../../common/types/basm_response'
import { Move } from '../../../../common/types/move'

import UpdateBaseController from './base'

const presenters = require('../../../../common/presenters')
const filters = require('../../../../config/nunjucks/filters')

type FormValues = { date?: string }
type AllocationRequest = Omit<BasmRequest, 'journeys' | 'move'> &
  Required<
    Pick<
      BasmRequest,
      | 'allocation'
      | 'flash'
      | 'form'
      | 'services'
      | 'session'
      | 'sessionModel'
      | 't'
    >
  >

class AllocationDetailsController extends UpdateBaseController {
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

  getReturnUrl(req: AllocationRequest) {
    return `/allocation/${req.allocation.id}`
  }

  configure(req: AllocationRequest, _res: BasmResponse, next: () => any) {
    req.form.options.next = this.getReturnUrl(req)
    next()
  }

  locals(
    req: AllocationRequest,
    _res: BasmResponse,
    callback: (err: any, locals?: object) => any
  ) {
    const locals = {
      cancelUrl: this.getReturnUrl(req),
      summary: presenters.allocationToMetaListComponent(req.allocation),
    }
    callback(null, locals)
  }

  async saveValues(
    req: AllocationRequest,
    _res: BasmResponse,
    next: (err?: any) => any
  ) {
    try {
      const id = req.allocation.id
      const date = req.form.values.date

      const allocation = await req.services.allocation.update({
        id,
        date,
      })

      req.sessionModel.set('allocation', allocation)
      this.setFlash(req)

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

  private setFlash(req: AllocationRequest) {
    const firstMove = req.allocation.moves[0] as Move | undefined
    const supplier = firstMove?.supplier?.name || req.t('supplier_fallback')

    req.flash('success', {
      title: req.t('allocations::update_flash.heading'),
      content: req.t('allocations::update_flash.message', { supplier }),
    })
  }
}

export { AllocationRequest }

export default AllocationDetailsController
