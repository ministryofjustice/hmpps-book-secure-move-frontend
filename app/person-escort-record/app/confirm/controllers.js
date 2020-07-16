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

  async saveValues(req, res, next) {
    try {
      await personEscortRecordService.confirm(req.personEscortRecord.id)
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
