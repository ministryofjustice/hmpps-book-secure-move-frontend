const { flatten, values } = require('lodash')

const FormController = require('./form')
const referenceDataService = require('../../../common/services/reference-data')

class AssessmentController extends FormController {
  async configure (req, res, next) {
    try {
      const { fields } = req.form.options

      await Promise
        .all(Object.keys(fields).map((key) => {
          const field = fields[key]

          if (!field.hasOwnProperty('items')) {
            return
          }

          return referenceDataService
            .getAssessmentQuestions(key)
            .then((response) => {
              field.items = response
                .map(referenceDataService.mapAssessmentConditionalFields(fields))
                .map(referenceDataService.mapToOption)
            })
        }))

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  saveValues (req, res, next) {
    const person = req.sessionModel.get('person') || {}
    const assessment = req.sessionModel.get('assessment') || {}
    const { fields } = req.form.options

    Object.keys(fields).forEach((field) => {
      const answers = req.form.values[field]

      assessment[field] = answers
        .filter(Boolean) // filter out any empty values
        .map((questionId) => {
          return {
            assessment_question_id: questionId,
          }
        })
    })

    req.form.values.assessment = assessment
    req.form.values.person = Object.assign({}, person, {
      assessment_answers: flatten(values(assessment)),
    })

    super.saveValues(req, res, next)
  }
}

module.exports = AssessmentController
