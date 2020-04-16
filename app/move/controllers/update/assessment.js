const { get, keys, pick } = require('lodash')

const personService = require('../../../../common/services/person')

const Assessment = require('../create/assessment')
const UpdateBase = require('./base')

const compare = (a, b) => {
  const key = 'assessment_question_id'
  if (a[key] < b[key]) {
    return -1
  }
  if (a[key] > b[key]) {
    return 1
  }
}
const getAnswerKeys = answers => {
  return answers
    .map(x => pick(x, ['key', 'assessment_question_id', 'comments']))
    .sort(compare)
}

class UpdateAssessmentController extends UpdateBase {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPreviousAssessment)
  }

  async saveValues(req, res, next) {
    try {
      const personId = req.getPersonId()
      const person = req.getPerson()
      const assessments = person.assessment_answers || []
      const fieldKeys = keys(get(req, 'form.options.fields'))

      const previousAssessments = assessments.filter(
        ({ key }) => !fieldKeys.includes(key)
      )

      const newAssessments = this.getAssessments(req, res)
      const updatedAssessments = [
        ...previousAssessments,
        ...newAssessments,
      ].sort(compare)
      // TODO: keep all existing NOMIS alerts
      // answer.nomis_alert_code
      // TODO: filter out requested answers
      // 'not_to_be_released', 'special_vehicle'))
      // TODO: don't set assessments if not from prison?
      // fromLocationType !== 'prison'

      const originalKeys = getAnswerKeys(assessments)
      const updatedKeys = getAnswerKeys(updatedAssessments)

      if (JSON.stringify(originalKeys) !== JSON.stringify(updatedKeys)) {
        await personService.update({
          id: personId,
          assessment_answers: updatedAssessments,
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

UpdateBase.mixin(UpdateAssessmentController, Assessment)

module.exports = UpdateAssessmentController
