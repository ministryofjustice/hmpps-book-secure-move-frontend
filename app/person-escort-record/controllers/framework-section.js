const { filter } = require('lodash')

const presenters = require('../../../common/presenters')

const FrameworksController = require('./frameworks')

class FrameworkSectionController extends FrameworksController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
  }

  setSectionSummary(req, res, next) {
    const { frameworkSection, personEscortRecord, originalUrl, form } = req
    const { name, steps } = frameworkSection
    const stepSummaries = Object.entries(steps).map(
      presenters.frameworkStepToSummary(
        form.options.allFields,
        personEscortRecord.responses,
        originalUrl
      )
    )

    res.locals.sectionTitle = name
    res.locals.summarySteps = filter(stepSummaries)

    next()
  }
}

module.exports = FrameworkSectionController
