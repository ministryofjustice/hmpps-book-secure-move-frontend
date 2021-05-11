const { set } = require('lodash')

const fieldHelpers = require('../../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../../common/helpers/reference-data')

const CreateBaseController = require('./base')

class PersonalDetailsController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const genders = await req.services.referenceData.getGenders()
      const ethnicities = await req.services.referenceData.getEthnicities()
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
      req.form.options.fields.ethnicity.items =
        fieldHelpers.insertInitialOption(ethnicityOptions, 'ethnicity')
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

  async saveValues(req, res, next) {
    try {
      const personService = req.services.person
      const person = req.sessionModel.get('person')
      const newPersonId = req.sessionModel.get('newPersonId')
      const data = { ...req.form.values }

      if (person && person.id === newPersonId) {
        req.form.values.person = await personService.update({
          ...data,
          id: newPersonId,
        })
      } else {
        const newPerson = await personService.create(data)
        req.form.values.person = newPerson
        req.form.values.newPersonId = newPerson.id
      }

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PersonalDetailsController
