const { flatten, values } = require('lodash')

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
      const implicitQuestions = questions.filter(
        fieldHelpers.extractItemsForImplicitFields.bind(null, fields)
      )

      if (implicitQuestions.length) {
        const implicitField = createFields.assessmentCategory(
          assessmentCategory
        )

        req.form.options.fields[assessmentCategory] = {
          ...implicitField,
          items: implicitQuestions
            .map(fieldHelpers.mapAssessmentQuestionToConditionalField)
            .map(fieldHelpers.mapAssessmentQuestionToTranslation)
            .map(fieldHelpers.mapReferenceDataToOption),
        }
      }

      req.form.options.fields = fieldHelpers.mapDependentFields(
        fields,
        questions,
        assessmentCategory
      )

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
    const implicitAnswers = req.form.values[assessmentCategory] || []

    assessment[assessmentCategory] = req.questions
      .filter(({ id, key }) => {
        return (
          implicitAnswers.includes(id) ||
          req.form.values[`${key}__yesno`] === 'yes'
        )
      })
      .map(question => {
        return {
          assessment_question_id: question.id,
          comments: req.form.values[`${question.key}`],
        }
      })

    req.form.values.assessment = assessment
    req.form.values.person = {
      ...person,
      assessment_answers: flatten(values(assessment)),
    }

    super.saveValues(req, res, next)
  }
}

module.exports = AssessmentController
