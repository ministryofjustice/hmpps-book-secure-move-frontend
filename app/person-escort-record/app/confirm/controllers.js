const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')

class ConfirmPersonEscortRecordController extends ConfirmAssessmentController {
  async saveValues(req, res, next) {
    try {
      await req.services.personEscortRecord.confirm(req.assessment.id)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  ConfirmPersonEscortRecordController,
}
