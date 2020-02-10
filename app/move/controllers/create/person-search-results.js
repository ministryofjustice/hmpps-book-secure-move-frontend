const { find } = require('lodash')

const CreateBaseController = require('./base')

const fieldHelpers = require('../../../../common/helpers/field')
const personService = require('../../../../common/services/person')

class PncResultsController extends CreateBaseController {
  async configure(req, res, next) {
    const searchType = req.session['hmpo-wizard-create-move']
      .nomis_offender_no_search_term
      ? 'nomis'
      : 'pnc'

    const searchTerm =
      searchType === 'nomis'
        ? req.session['hmpo-wizard-create-move'].nomis_offender_no_search_term
        : req.session['hmpo-wizard-create-move'].police_national_computer_search_term

    const {
      person_search_term_result: searchResultsField,
    } = req.form.options.fields

    if (searchTerm) {
      try {
        const people = await personService.findAll(searchTerm, searchType)
        searchResultsField.items = people.map(fieldHelpers.mapPersonToOption)

        if (searchResultsField.items.length) {
          searchResultsField.validate = 'required'
        } else {
          searchResultsField.skip = true
          res.locals.hideContinueButton = true
        }

        res.locals.people = people
        res.locals.searchTerm = searchTerm
        res.locals.searchType = searchType
      } catch (error) {
        next(error)
      }
    }

    if (!searchResultsField.items.length && searchType === 'pnc') {
      const queryString = searchTerm
        ? `?police_national_computer_search_term=${searchTerm}`
        : ''

      delete req.form.options.fields.person_search_term_result
      return res.redirect(`/move/new/personal-details${queryString}`)
    }

    super.configure(req, res, next)
  }

  async saveValues(req, res, next) {
    const personId = req.body.person_search_term_result

    if (personId) {
      const person = find(res.locals.people, { id: personId })
      const pnc = find(person.identifiers, {
        identifier_type: 'police_national_computer',
      })

      const nomisOffenderNo = find(person.identifiers, {
        identifier_type: 'nomis_offender_no',
      })

      req.form.values = {
        ...req.form.values,
        ...person,
        person,
        ethnicity: person.ethnicity.id,
        gender: person.gender.id,
        police_national_computer: pnc ? pnc.value : '',
        nomis_offender_no: nomisOffenderNo ? nomisOffenderNo.value : '',
      }
    }

    super.saveValues(req, res, next)
  }
}

module.exports = PncResultsController
