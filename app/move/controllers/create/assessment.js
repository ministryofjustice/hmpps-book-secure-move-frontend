const { flatten, values } = require('lodash')

const CreateBaseController = require('./base')
const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataService = require('../../../../common/services/reference-data')

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

  saveValues(req, res, next) {
    const person = req.sessionModel.get('person') || {}
    const assessment = req.sessionModel.get('assessment') || {}
    const formValues = flatten(Object.values(req.form.values))
    const { assessmentCategory } = req.form.options

    assessment[assessmentCategory] = req.questions
      .filter(({ id }) => formValues.includes(id))
      .map(({ id, key }) => {
        return {
          assessment_question_id: id,
          comments: req.form.values[key],
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
