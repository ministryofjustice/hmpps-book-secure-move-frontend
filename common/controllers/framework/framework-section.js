const { filter } = require('lodash')

const presenters = require('../../presenters')
const FormWizardController = require('../form-wizard')

class FrameworkSectionController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
    this.use(this.setMoveId)
    this.use(this.setEditableStatus)
  }

  setMoveId(req, res, next) {
    res.locals.moveId = req.move?.id || req.assessment?.move?.id
    next()
  }

  setEditableStatus(req, res, next) {
    res.locals.isEditable = req.assessment.editable
    next()
  }

  setSectionSummary(req, res, next) {
    const { frameworkSection, assessment, baseUrl, form } = req
    const { name, steps } = frameworkSection
    const stepSummaries = Object.entries(steps).map(
      presenters.frameworkStepToSummary(
        form.options.allFields,
        assessment.responses,
        `${baseUrl}/`
      )
    )

    res.locals.sectionTitle = name
    res.locals.summarySteps = filter(stepSummaries)

    next()
  }
}

module.exports = FrameworkSectionController
