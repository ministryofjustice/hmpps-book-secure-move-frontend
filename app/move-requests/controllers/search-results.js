const { cloneDeep } = require('lodash')
const FormWizardController = require('../../../common/controllers/form-wizard')

const fieldHelpers = require('../../../common/helpers/field')

const personService = require('../../../common/services/person')

class searchResults extends FormWizardController {
  async configure(req, res, next) {
    const prisonNumber = req.query.prison_number
    if (prisonNumber) {
      const query = {
        'filter[prison_number]': prisonNumber,
      }
      try {
        res.locals.people = await personService.findAll(query)
        const items = res.locals.people.map(fieldHelpers.mapPersonToOption)
        if (items.length) {
          const field = cloneDeep(
            req.form.options.fields.prison_number_search_results
          )
          field.validate = 'required'
          field.items = items
          req.form.options.fields.prison_number_search_results = field
        }
      } catch (error) {
        next(error)
      }
    }
    super.configure(req, res, next)
  }
}

module.exports = searchResults
