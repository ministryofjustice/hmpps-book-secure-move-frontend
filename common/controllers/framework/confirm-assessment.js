const { get } = require('lodash')

const FormWizardController = require('../form-wizard')

class ConfirmAssessmentController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkStatus)
    super.middlewareChecks()
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
    const { assessment } = req
    const services = {
      'person-escort-record': req.services.personEscortRecord,
      'youth-risk-assessment': req.services.youthRiskAssessment,
    }

    try {
      await services[assessment.framework.name].confirm(assessment.id)
      next()
    } catch (error) {
      next(error)
    }
  }

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'invalid_status') {
      return this.successHandler(req, res)
    }

    super.errorHandler(err, req, res, next)
  }

  successHandler(req, res) {
    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${req.move.id}`)
  }
}

module.exports = ConfirmAssessmentController
