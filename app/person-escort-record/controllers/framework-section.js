const { filter } = require('lodash')

const presenters = require('../../../common/presenters')

const FrameworksController = require('./frameworks')

class FrameworkSectionController extends FrameworksController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
    this.use(this.setMoveId)
  }

  setMoveId(req, res, next) {
    const { move } = req

    // TODO: Need to make sure this is available if accessing the PER directly
    res.locals.moveId = move.id

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
