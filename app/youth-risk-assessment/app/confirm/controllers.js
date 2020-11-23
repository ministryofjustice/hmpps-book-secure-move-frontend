const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')
const youthRiskAssessmentService = require('../../../../common/services/youth-risk-assessment')

class ConfirmYouthRiskAssessmentController extends ConfirmAssessmentController {
  async saveValues(req, res, next) {
    try {
      await youthRiskAssessmentService.confirm(req.assessment.id)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  ConfirmYouthRiskAssessmentController,
}
