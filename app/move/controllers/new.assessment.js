const { flatten, values } = require('lodash')

const FormController = require('./new.form')
const fieldHelpers = require('../../../common/helpers/field')
const referenceDataService = require('../../../common/services/reference-data')

class AssessmentController extends FormController {
  async configure (req, res, next) {
    try {
      const { fields } = req.form.options

      await Promise.all(
        Object.keys(fields).map(key => {
          const field = fields[key]

          if (!field.hasOwnProperty('items')) {
            return
          }

          return referenceDataService
            .getAssessmentQuestions(key)
            .then(response => {
              field.items = response
                .map(fieldHelpers.mapAssessmentQuestionToConditionalField)
                .map(fieldHelpers.mapReferenceDataToOption)
            })
        })
      )

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  saveValues (req, res, next) {
    const person = req.sessionModel.get('person') || {}
    const assessment = req.sessionModel.get('assessment') || {}
    const { fields } = req.form.options

    Object.keys(fields).forEach(key => {
      const field = fields[key]

      if (!field.multiple) {
        return
      }
      const answers = req.form.values[key]

      assessment[key] = field.items
        .filter(item => answers.includes(item.value))
        .map(item => {
          return {
            comments: req.form.values[`${key}__${item.key}`],
            assessment_question_id: item.value,
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
