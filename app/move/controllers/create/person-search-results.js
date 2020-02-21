const { has, find } = require('lodash')

const PersonController = require('./person')

const fieldHelpers = require('../../../../common/helpers/field')
const personService = require('../../../../common/services/person')

class PersonSearchResultsController extends PersonController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setPeople)
    this.use(this.setPeopleItems)
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkFilter)
  }

  async setPeople(req, res, next) {
    req.people = []

    if (has(req.query, 'filter')) {
      try {
        req.people = await personService.getByIdentifiers(req.query.filter)
      } catch (error) {
        return next(error)
      }
    }

    next()
  }

  setPeopleItems(req, res, next) {
    const { people } = req.form.options.fields
    people.items = req.people.map(fieldHelpers.mapPersonToOption)
    next()
  }

  checkFilter(req, res, next) {
    const sessionData = req.sessionModel.toJSON()
    const filters = Object.keys(sessionData)
      .filter(key => key.includes('filter.'))
      .map(
        name => `filter[${name.replace('filter.', '')}]=${sessionData[name]}`
      )

    if (!has(req.query, 'filter') && filters.length) {
      return res.redirect(
        req.baseUrl + req.path + (filters.length ? `?${filters.join('&')}` : '')
      )
    }

    next()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setSearchLocals)
  }

  setSearchLocals(req, res, next) {
    res.locals.resultCount = req.people.length
    next()
  }

  saveValues(req, res, next) {
    req.form.values.person = find(req.people, { id: req.form.values.people })
    super.saveValues(req, res, next)
  }
}

module.exports = PersonSearchResultsController
