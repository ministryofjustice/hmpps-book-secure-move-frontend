const { flatten, get, values } = require('lodash')

const fieldHelpers = require('../../../../../common/helpers/field')
const presenters = require('../../../../../common/presenters')

const CreateBaseController = require('./base')

class AssessmentController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const { fields, assessmentCategory } = req.form.options
      const questions =
        await req.services.referenceData.getAssessmentQuestions(
          assessmentCategory
        )

      req.form.options.fields = this.processFields(
        fieldHelpers.populateAssessmentFields(fields, questions)
      )

      req.questions = questions
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  processFields(fields) {
    return fields
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPreviousAssessment)
  }

  setPreviousAssessment(req, res, next) {
    const {
      assessmentCategory,
      customAssessmentGroupings = [],
      showPreviousAssessment,
    } = req.form.options
    const profile = req.getProfile()

    if (showPreviousAssessment) {
      const customAssessmentKeys = customAssessmentGroupings
        .map(grouping => grouping.keys)
        .flat()
      const previousAnswers = profile.assessment_answers
        .filter(answer => answer.category === assessmentCategory)
        .filter(answer => answer.imported_from_nomis)
      const previousAnswersByCategory = presenters
        .assessmentAnswersByCategory(
          previousAnswers.filter(
            answer => !customAssessmentKeys.includes(answer.key)
          )
        )
        .filter(category => category.key === assessmentCategory)
        .map(presenters.assessmentCategoryToPanelComponent)

      res.locals.previousAnswers = previousAnswersByCategory[0]

      res.locals.customAnswerGroupings = customAssessmentGroupings.map(
        grouping => {
          const byCategory = presenters
            .assessmentAnswersByCategory(
              previousAnswers.filter(answer =>
                grouping.keys.includes(answer.key)
              )
            )
            .filter(category => category.key === assessmentCategory)
            .map(presenters.assessmentCategoryToPanelComponent)

          return {
            ...byCategory[0],
            key: grouping.i18nContext,
          }
        }
      )
    }

    next()
  }

  getAssessments(req, res) {
    const formValues = flatten(values(get(req, 'form.values')))
    return req.questions
      .filter(({ id }) => formValues.includes(id))
      .map(({ id, key }) => {
        return {
          key,
          assessment_question_id: id,
          comments: req.form.values[key],
        }
      })
  }

  saveValues(req, res, next) {
    const assessment = req.sessionModel.get('assessment') || {}
    const { assessmentCategory } = req.form.options

    assessment[assessmentCategory] = this.getAssessments(req, res)

    req.form.values.assessment = assessment

    super.saveValues(req, res, next)
  }
}

module.exports = AssessmentController
