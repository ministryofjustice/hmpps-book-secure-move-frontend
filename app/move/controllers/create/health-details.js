const AssessmentController = require('./assessment')
const { get, set } = require('lodash')

class HealthDetails extends AssessmentController {
  async render(req, res, next) {
    const questionToExtrapolate = get(
      req,
      'form.options.fields.health__wheelchair'
    )
    if (questionToExtrapolate) {
      set(req, 'form.options.fields.health__wheelchair.extrapolated', true)
    }
    super.render(...arguments)
  }
}
module.exports = HealthDetails
