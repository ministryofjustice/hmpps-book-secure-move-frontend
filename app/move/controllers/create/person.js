const { has } = require('lodash')

const CreateBaseController = require('./base')

class PersonController extends CreateBaseController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkManualCreation)
  }

  checkManualCreation(req, res, next) {
    if (has(req.query, 'skip')) {
      req.form.options.skip = true
      req.sessionModel.set('is_manual_person_creation', true)
      return this.successHandler(req, res, next)
    }

    req.sessionModel.set('is_manual_person_creation', false)
    next()
  }
}

module.exports = PersonController
