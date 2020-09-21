const { filter } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

class FrameworkSectionController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
    this.use(this.setMoveId)
    this.use(this.setEditableStatus)
  }

  setMoveId(req, res, next) {
    // TODO: Make available when accessing PER without a move based URLs
    res.locals.moveId = req.move?.id

    next()
  }

  setEditableStatus(req, res, next) {
    res.locals.isEditable = req.personEscortRecord?.isEditable
    next()
  }

  setSectionSummary(req, res, next) {
    const { frameworkSection, personEscortRecord, baseUrl, form } = req
    const { name, steps } = frameworkSection
    const stepSummaries = Object.entries(steps).map(
      presenters.frameworkStepToSummary(
        form.options.allFields,
        personEscortRecord.responses,
        `${baseUrl}/`
      )
    )

    res.locals.sectionTitle = name
    res.locals.summarySteps = filter(stepSummaries)

    next()
  }
}

module.exports = FrameworkSectionController
