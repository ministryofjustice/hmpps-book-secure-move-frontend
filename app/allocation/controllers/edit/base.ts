import { BasmRequest } from '../../../../common/types/basm_request'
import { BasmResponse } from '../../../../common/types/basm_response'


const CreateBaseController = require('../create/base')

const presenters = require('../../../../common/presenters')

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
class UpdateBaseController extends CreateBaseController {
  constructor(options: any) {
    super(options)
  }

  getReturnUrl(req: AllocationRequest) {
    return `/allocation/${req.allocation.id}`
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


}

export { AllocationRequest }

export default UpdateBaseController
