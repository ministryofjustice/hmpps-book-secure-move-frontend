const { get, set } = require('lodash')

const CreateBaseController = require('./base')
const fieldHelpers = require('../../../../common/helpers/field')
const personService = require('../../../../common/services/person')
const referenceDataService = require('../../../../common/services/reference-data')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')

class PersonalDetailsController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const genders = await referenceDataService.getGenders()
      const ethnicities = await referenceDataService.getEthnicities()
      const genderOptions = genders
        .filter(referenceDataHelpers.filterDisabled())
        .map(fieldHelpers.mapReferenceDataToOption)
        .map(
          fieldHelpers.insertItemConditional({
            key: 'trans',
            field: 'gender_additional_information',
          })
        )
      const ethnicityOptions = ethnicities
        .filter(referenceDataHelpers.filterDisabled())
        .map(fieldHelpers.mapReferenceDataToOption)
      const pncSearchTerm = req.query.police_national_computer_search_term || ''

      req.form.options.fields.gender.items = genderOptions
      req.form.options.fields.ethnicity.items = fieldHelpers.insertInitialOption(
        ethnicityOptions,
        'ethnicity'
      )
      set(
        req,
        'form.options.fields.police_national_computer.default',
        pncSearchTerm
      )

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  savePerson(id, data) {
    if (id) {
      return personService.update({
        id,
        ...data,
      })
    }

    return personService.create(data)
  }

  async saveValues(req, res, next) {
    try {
      const id = get(req.sessionModel.get('person'), 'id')

      req.form.values.person = await this.savePerson(id, req.form.values)
      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PersonalDetailsController
