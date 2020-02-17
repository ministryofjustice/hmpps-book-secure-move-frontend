const { find } = require('lodash')

const CreateBaseController = require('./base')

const fieldHelpers = require('../../../../common/helpers/field')
const personService = require('../../../../common/services/person')

class PncResultsController extends CreateBaseController {
  async configure(req, res, next) {
    const pncSearchTerm = req.query.police_national_computer_search_term
    const {
      police_national_computer_search_term_result: searchResultsField,
    } = req.form.options.fields

    if (pncSearchTerm) {
      try {
        const people = await personService.getByIdentifiers({
          police_national_computer: pncSearchTerm,
        })
        searchResultsField.items = people.map(fieldHelpers.mapPersonToOption)

        if (searchResultsField.items.length) {
          searchResultsField.validate = 'required'
        }

        res.locals.people = people
        res.locals.pncSearchTerm = pncSearchTerm
      } catch (error) {
        next(error)
      }
    }

    if (!searchResultsField.items.length) {
      const queryString = pncSearchTerm
        ? '?police_national_computer_search_term=' + pncSearchTerm
        : ''

      delete req.form.options.fields.police_national_computer_search_term_result

      return res.redirect(`/move/new/personal-details${queryString}`)
    }

    super.configure(req, res, next)
  }

  async saveValues(req, res, next) {
    const personId = req.body.police_national_computer_search_term_result

    if (personId) {
      const person = find(res.locals.people, { id: personId })
      const pnc = find(person.identifiers, {
        identifier_type: 'police_national_computer',
      })

      req.form.values = {
        ...req.form.values,
        ...person,
        person,
        ethnicity: person.ethnicity.id,
        gender: person.gender.id,
        police_national_computer: pnc ? pnc.value : '',
      }
    }

    super.saveValues(req, res, next)
  }
}

module.exports = PncResultsController
