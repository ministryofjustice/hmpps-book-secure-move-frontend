const AssessmentController = require('./assessment')
const { get, set } = require('lodash')

class HealthDetails extends AssessmentController {
  async render(req, res, next) {
/*    const questionToExtrapolate = get(
      req,
      'form.options.fields.health__special_vehicle'
    )*/
    // if (questionToExtrapolate) {
     // set(req, 'form.options.fields.health__special_vehicle.extrapolated', true)
    //}
    super.render(req, res, next)
  }
}
module.exports = HealthDetails
