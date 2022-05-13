const { get, snakeCase } = require('lodash')

const setMoveSummary = require('../../middleware/set-move-summary')
const FormWizardController = require('../form-wizard')

class ConfirmAssessmentController extends FormWizardController {
  middlewareLocals() {
    this.use(setMoveSummary)
    super.middlewareLocals()
  }

  middlewareChecks() {
    this.use(this.checkStatus)
    super.middlewareChecks()
  }

  checkStatus(req, res, next) {
    const moveId = req.move?.id

    const isAllowed =
      req?.assessment?.status === 'completed' ||
      (req?.assessment?.framework?.name === 'person-escort-record' &&
        req?.assessment?.status === 'confirmed')

    if (isAllowed) {
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
    const context = snakeCase(req.assessment.framework.name)
    const moveId = req.move?.id || req.assessment?.move?.id
    const name = req.assessment?.profile?.person?._fullname

    req.journeyModel.reset()
    req.sessionModel.reset()

    req.flash('success', {
      title: req.t('messages::assessment_confirmed.heading', { context }),
      content: req.t('messages::assessment_confirmed.content', {
        context,
        name,
        timelineUrl: `/move/${moveId}/timeline`,
      }),
    })

    res.redirect(`/move/${moveId}`)
  }
}

module.exports = ConfirmAssessmentController
