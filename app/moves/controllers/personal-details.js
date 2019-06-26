const FormController = require('./form')
const fieldHelpers = require('../../../common/helpers/field')
const personService = require('../../../common/services/person')
const referenceDataService = require('../../../common/services/reference-data')

class PersonalDetailsController extends FormController {
  async configure (req, res, next) {
    try {
      const genders = await referenceDataService.getGenders()
      const ethnicities = await referenceDataService.getEthnicities()
      const genderOptions = genders.map(fieldHelpers.mapReferenceDataToOption)
      const ethnicityOptions = ethnicities.map(fieldHelpers.mapReferenceDataToOption)

      req.form.options.fields.gender.items = genderOptions
      req.form.options.fields.ethnicity.items = fieldHelpers.insertInitialOption(ethnicityOptions, 'ethnicity')

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async saveValues (req, res, next) {
    try {
      req.form.values.person = await personService.create(req.form.values)
      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PersonalDetailsController
