const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

class ConfirmPersonEscortRecordController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveId)
  }

  setMoveId(req, res, next) {
    res.locals.moveId = req.move?.id
    next()
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkStatus)
  }

  checkStatus(req, res, next) {
    const moveId = req.move?.id
    const isCompleted = req?.assessment?.status === 'completed'

    if (isCompleted) {
      return next()
    }

    res.redirect(`/move/${moveId}`)
  }

  async saveValues(req, res, next) {
    try {
      await personEscortRecordService.confirm(req.assessment.id)
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
  ConfirmPersonEscortRecordController,
}
