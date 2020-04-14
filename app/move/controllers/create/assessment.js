const { find, flatten } = require('lodash')

const fieldHelpers = require('../../../../common/helpers/field')
const presenters = require('../../../../common/presenters')
const referenceDataService = require('../../../../common/services/reference-data')

const CreateBaseController = require('./base')

class AssessmentController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const { fields, assessmentCategory } = req.form.options
      const questions = await referenceDataService.getAssessmentQuestions(
        assessmentCategory
      )

      req.form.options.fields = fieldHelpers.populateAssessmentFields(
        fields,
        questions
      )

      req.questions = questions
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPreviousAssessment)
  }

  setPreviousAssessment(req, res, next) {
    const { assessmentCategory, previousAssessmentKeys = [] } = req.form.options
    const person = req.sessionModel.get('person') || {}
    const filteredAssessment = person.assessment_answers
      .filter(answer => answer.category === assessmentCategory)
      .filter(answer => previousAssessmentKeys.includes(answer.key))
      .filter(answer => answer.imported_from_nomis)

    if (previousAssessmentKeys.length) {
      const previousAssessmentByCategory = presenters.assessmentByCategory(
        filteredAssessment
      )
      res.locals.previousAssessment = find(previousAssessmentByCategory, {
        key: assessmentCategory,
      })
    }

    next()
  }

  saveValues(req, res, next) {
    const assessment = req.sessionModel.get('assessment') || {}
    const formValues = flatten(Object.values(req.form.values))
    const { assessmentCategory } = req.form.options

    assessment[assessmentCategory] = req.questions
      .filter(({ id }) => formValues.includes(id))
      .map(({ id, key }) => {
        return {
          key,
          assessment_question_id: id,
          comments: req.form.values[key],
        }
      })

    req.form.values.assessment = assessment

    super.saveValues(req, res, next)
  }
}

module.exports = AssessmentController
