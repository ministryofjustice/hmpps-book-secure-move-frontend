const CreateBaseController = require('./base')

class ExtraditionDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  process(req, res, next) {
    next()
  }
}

module.exports = ExtraditionDetailsController
