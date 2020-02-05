const { cloneDeep, find, filter, flatten, values, mapValues } = require('lodash')

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

      const implicitFields = questions.filter(question => {
        const key = question.key
        const field = fields[`${assessmentCategory}__${key}`]

        return fields[`${assessmentCategory}__${key}`] && !field.explicit
      })

      questions.forEach(question => {
        const key = question.key

        if (fields[`${assessmentCategory}__${key}`]) {
          const field = cloneDeep(fields[`${assessmentCategory}__${key}`])

          if (field.explicit) {
            const explicitField = createFields.explicitYesNo(key)
            explicitField.items[0].conditional = `${assessmentCategory}__${key}`

            fields[`${key}__yesno`] = explicitField

            // fieldHelpers.appendDependent(field, assessmentCategory, question)
            fields[`${assessmentCategory}__${key}`] = field
          }
        }
      })

      req.form.options.fields = mapValues(req.form.options.fields, (field, key) => {
        const question = find(questions, { key: key.replace(`${assessmentCategory}__`, '') })
        let dependent = {}

        if (question) {
          if (field.explicit) {
            dependent = {
              field: `${question.key}__yesno`,
              value: 'yes',
            }
          } else {
            dependent = {
              field: assessmentCategory,
              value: question.id,
            }
          }
        }

        return {
          ...field,
          dependent,
        }
      })

      const implicitField = createFields.assessmentCategory(assessmentCategory)
      implicitField.items = implicitFields
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
          comments: req.form.values[`${assessmentCategory}__${question.key}`],
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
