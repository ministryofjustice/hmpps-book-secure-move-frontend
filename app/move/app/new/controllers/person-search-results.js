const { has, find } = require('lodash')

const presenters = require('../../../../../common/presenters')
const componentService = require('../../../../../common/services/component')

const PersonController = require('./person')

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
        const { filter } = req.query
        req.people = await req.services.person.getByIdentifiers(filter)
        res.locals.filterBy = this.filterName(Object.keys(filter)[0])
      } catch (error) {
        return next(error)
      }
    }

    next()
  }

  filterName(filterKey) {
    return {
      prison_number: 'prison number',
      police_national_computer: 'PNC number',
    }[filterKey]
  }

  setPeopleItems(req, res, next) {
    const { from_location_type: locationType } = req.sessionModel.toJSON()
    const { people } = req.form.options.fields
    people.items = req.people.map(person => {
      const card = presenters.profileToCardComponent({
        locationType,
        showTags: false,
      })({ profile: { person } })

      return {
        html: componentService.getComponent('appCard', card),
        value: person.id,
        checked: req.people.length === 1,
      }
    })
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
    const filter = req.query.filter || {}
    const filters = Object.keys(filter)
    // TODO: When we support multiple filters this will need updating
    res.locals.searchTerm = filter ? filter[filters[0]] : undefined
    res.locals.resultCount = req.people.length
    next()
  }

  saveValues(req, res, next) {
    req.form.values.person = find(req.people, { id: req.form.values.people })
    super.saveValues(req, res, next)
  }
}

module.exports = PersonSearchResultsController
