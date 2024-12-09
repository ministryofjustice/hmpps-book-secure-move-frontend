import { BasmResponse } from '../../../../common/types/basm_response'
import { AllocationRequest } from '../edit/allocation-details'

export default function confirmation(
  req: AllocationRequest,
  res: BasmResponse
) {
  const allocation = req.allocation

  res.render('allocation/views/confirmation', {
    allocation,
  })
}
