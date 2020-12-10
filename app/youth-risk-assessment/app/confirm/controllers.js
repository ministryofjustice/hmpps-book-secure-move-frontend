const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')

class ConfirmYouthRiskAssessmentController extends ConfirmAssessmentController {
  async saveValues(req, res, next) {
    try {
      await req.services.youthRiskAssessment.confirm(req.assessment.id)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  ConfirmYouthRiskAssessmentController,
}
