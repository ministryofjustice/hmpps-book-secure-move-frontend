const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

class ConfirmPersonEscortRecordController extends ConfirmAssessmentController {
  async saveValues(req, res, next) {
    try {
      await personEscortRecordService.confirm(req.assessment.id)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  ConfirmPersonEscortRecordController,
}
