const { filter, snakeCase } = require('lodash')

const i18n = require('../../../config/i18n').default
const setPreviousNextFrameworkSection = require('../../middleware/framework/set-previous-next-framework-section')
const setMoveSummary = require('../../middleware/set-move-summary')
const presenters = require('../../presenters')
const FormWizardController = require('../form-wizard')

class FrameworkSectionController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSectionSummary)
    this.use(this.setMoveId)
    this.use(this.setEditableStatus)
    this.use(this.seti18nContext)
    this.use(setPreviousNextFrameworkSection)
    this.use(this.setPagination)
    this.use(setMoveSummary)
  }

  seti18nContext(req, res, next) {
    res.locals.i18nContext = snakeCase(req.assessment?.framework?.name || '')
    next()
  }

  setPagination(req, res, next) {
    const {
      previousFrameworkSection,
      nextFrameworkSection,
      frameworkSection: { key: currentSection },
    } = req

    const pagination = {
      classes: 'app-pagination--split govuk-!-margin-top-6',
    }

    if (previousFrameworkSection) {
      pagination.previous = {
        href: req.baseUrl.replace(currentSection, previousFrameworkSection.key),
        label: previousFrameworkSection.name,
        text: i18n.t('pagination.previous_section'),
      }
    }

    if (nextFrameworkSection) {
      pagination.next = {
        href: req.baseUrl.replace(currentSection, nextFrameworkSection.key),
        label: nextFrameworkSection.name,
        text: i18n.t('pagination.next_section'),
      }
    }

    res.locals.sectionPagination = pagination

    next()
  }

  setMoveId(req, res, next) {
    res.locals.moveId = req.move?.id || req.assessment?.move?.id
    next()
  }

  setEditableStatus(req, res, next) {
    const { editable, framework } = req.assessment

    res.locals.isEditable =
      editable && req.canAccess(`${snakeCase(framework.name)}:update`)

    next()
  }

  setSectionSummary(req, res, next) {
    const tagClasses = {
      not_started: 'govuk-tag--grey',
      in_progress: 'govuk-tag--blue',
      default: '',
    }

    const { frameworkSection, assessment, baseUrl, form } = req
    const { name, steps } = frameworkSection
    const stepSummaries = Object.entries(steps).map(
      presenters.frameworkStepToSummary(
        form.options.allFields,
        assessment.responses,
        `${baseUrl}/`
      )
    )
    const sectionProgress = assessment.meta?.section_progress.filter(
      status => status.key === frameworkSection.key
    )[0]

    res.locals.sectionTitle = name
    res.locals.sectionProgress = {
      text: i18n.t(`assessment::statuses.${sectionProgress.status}`),
      classes: tagClasses[sectionProgress.status] || tagClasses.default,
    }
    res.locals.summarySteps = filter(stepSummaries)

    next()
  }
}

module.exports = FrameworkSectionController
