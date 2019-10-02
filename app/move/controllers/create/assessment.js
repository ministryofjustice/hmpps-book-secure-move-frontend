const { flatten, values } = require('lodash')

const CreateBaseController = require('./base')
const fieldHelpers = require('../../../../common/helpers/field')

class AssessmentController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const { fields } = req.form.options

      await fieldHelpers.setupAssessmentQuestions(fields)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  saveValues(req, res, next) {
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
