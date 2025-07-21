import { BasmResponse } from '../../../../common/types/basm_response'
import { Move } from '../../../../common/types/move'

import UpdateBaseController, { AllocationRequest } from './base'

type FormValues = { date_changed_reason?: string }

class AllocationDateChangedReasonController extends UpdateBaseController {

  configure(req: AllocationRequest, _res: BasmResponse, next: () => any) {
    req.form.options.next = this.getReturnUrl(req)
    next()
  }

  async saveValues(
    req: AllocationRequest,
    _res: BasmResponse,
    next: (err?: any) => any
  ) {
    try {
      const id = req.allocation.id
      const date = req.sessionModel.get('proposedDate')
      const { date_changed_reason } = req.form.values

      await req.services.allocation.update({
        id,
        date,
        date_changed_reason,
      })

      this.setFlash(req)

      next()
    } catch (err) {
      next(err)
    }
  }

  render(req: AllocationRequest, res: BasmResponse, next: () => void) {
    super.render(req, res, next)
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

export default AllocationDateChangedReasonController
