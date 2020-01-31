const AssessmentController = require('./assessment')
const { get, set } = require('lodash')

class HealthDetails extends AssessmentController {
  saveValues(req, res, next) {
    if (get(req, 'form.values.health__special_vehicle') === 'yes') {
      const health = get(req, 'form.values.health')
      Array.isArray(health) && health.push('health__special_vehicle')
      set(req, 'form.values.health', health)
    }
    return super.saveValues(req, res, next)
  }
}
module.exports = HealthDetails
