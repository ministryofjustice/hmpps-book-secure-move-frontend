const {
  cloneDeep,
  find,
  filter,
  forEach,
  flatten,
  values,
  mapValues,
} = require('lodash')

const CreateBaseController = require('./base')
const fieldHelpers = require('../../../../common/helpers/field')
const createFields = require('../../fields/create')
const referenceDataService = require('../../../../common/services/reference-data')

class AssessmentController extends CreateBaseController {

  async configure(req, res, next) {
    try {
      const { fields, assessmentCategory } = req.form.options
      const questions = await referenceDataService.getAssessmentQuestions(
        assessmentCategory
      )

      req.form.options.fields = mapValues(
        req.form.options.fields,
        createFields.appendDependent.bind(null, questions, assessmentCategory)
      )

      req.form.options.fields = forEach(
        req.form.options.fields,
        createFields.decorateWithExplicitFields.bind(
          null,
          questions,
          req.form.options.fields
        )
      )

      const implicitField = createFields.assessmentCategory(assessmentCategory)
      implicitField.items = questions
        .filter(question => {
          const key = question.key
          const field = fields[key]

          return fields[key] && !field.explicit
        })
        .map(fieldHelpers.mapAssessmentQuestionToConditionalField)
        .map(fieldHelpers.mapAssessmentQuestionToTranslation)
        .map(fieldHelpers.mapReferenceDataToOption)

      req.form.options.fields[assessmentCategory] = implicitField

      req.questions = questions
      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  saveValues(req, res, next) {
    const person = req.sessionModel.get('person') || {}
    const assessment = req.sessionModel.get('assessment') || {}
    const { assessmentCategory } = req.form.options
    const implicitAnswers = req.form.values[assessmentCategory]

    assessment[assessmentCategory] = req.questions
      .filter(question => {
        if (implicitAnswers.includes(question.id)) {
          return true
        }
        return req.form.values[`${question.key}__yesno`] === 'yes'
      })
      .map(question => {
        return {
          assessment_question_id: question.id,
          comments: req.form.values[`${question.key}`],
        }
      })

    req.form.values.assessment = assessment
    req.form.values.person = Object.assign({}, person, {
      assessment_answers: flatten(values(assessment)),
    })

    super.saveValues(req, res, next)
  }
}

module.exports = AssessmentController
