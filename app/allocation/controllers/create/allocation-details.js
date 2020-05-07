const commonMiddleware = require('../../../../common/middleware')

const CreateAllocationBaseController = require('./base')

class AllocationDetailsController extends CreateAllocationBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(commonMiddleware.setLocationItems('prison', 'from_location'))
    this.use(commonMiddleware.setLocationItems('prison', 'to_location'))
  }
}
module.exports = AllocationDetailsController
