import CreateAllocationBaseController from './base'

const commonMiddleware = require('../../../../common/middleware')

export default class AllocationDetailsController extends CreateAllocationBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(commonMiddleware.setLocationItems('prison', 'from_location'))
    this.use(commonMiddleware.setLocationItems('prison', 'to_location'))
  }
}
