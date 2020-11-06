const PersonController = require('./person')

class PersonSearchController extends PersonController {
  successHandler(req, res) {
    const values = req.form?.values || {}
    const nextStep = this.getNextStep(req, res)
    const filters = Object.keys(values)
      .filter(key => key.includes('filter.'))
      .map(name => `filter[${name.replace('filter.', '')}]=${values[name]}`)

    this.setStepComplete(req, res)

    return res.redirect(
      nextStep + (filters.length ? `?${filters.join('&')}` : '')
    )
  }

  saveValues(req, res, next) {
    req.form.values.police_national_computer =
      req.form.values['filter.police_national_computer']
    super.saveValues(req, res, next)
  }
}

module.exports = PersonSearchController
