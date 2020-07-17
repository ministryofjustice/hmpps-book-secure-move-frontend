const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

class NewPersonEscortRecordController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkProfileExists)
  }

  checkProfileExists(req, res, next) {
    if (req.move?.profile?.id) {
      return next()
    }

    const error = new Error('Move profile not found')
    error.statusCode = 404

    next(error)
  }

  async saveValues(req, res, next) {
    try {
      req.record = await personEscortRecordService.create(req.move.profile.id)
      next()
    } catch (err) {
      next(err)
    }
  }

  successHandler(req, res) {
    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${req.move.id}`)
  }
}

module.exports = {
  NewPersonEscortRecordController,
}
