const FormWizardController = require('../../../common/controllers/form-wizard')

const personService = require('../../../common/services/person')

class searchResults extends FormWizardController {
  async configure(req, res, next) {
    const { prisonNumber } = req.query.prison_number
    if (prisonNumber) {
      const query = {
        'filter[prison_number]': prisonNumber,
      }
      try {
        res.locals.people = await personService.findAll(query)
      } catch (error) {
        next(error)
      }
    }
    super.configure(req, res, next)
  }
}

module.exports = searchResults
