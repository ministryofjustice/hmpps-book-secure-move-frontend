const AssessmentController = require('./assessment')
const { get, set, find, findIndex } = require('lodash')

class HealthDetails extends AssessmentController {
  render(req, res, next) {
    const fields = get(req, 'form.options.fields.health.items')
    if (Array.isArray(fields)) {
      const fieldWithVehicleIndex = findIndex(fields, [
        'key',
        'special_vehicle',
      ])
      fields.splice(fieldWithVehicleIndex, 1)
      set(req, 'form.options.fields.health.items', fields)
    }
    super.render(req, res, next)
  }

  saveValues(req, res, next) {
    if (get(req, 'form.values.health__special_vehicle') === 'yes') {
      const health = get(req, 'form.values.health')
      const valueOfOriginalQuestion = find(
        get(req, 'form.options.fields.health.items'),
        ['key', 'special_vehicle']
      ).value
      Array.isArray(health) && health.push(valueOfOriginalQuestion)
      set(req, 'form.values.health', health)
    }
    return super.saveValues(req, res, next)
  }
}
module.exports = HealthDetails
