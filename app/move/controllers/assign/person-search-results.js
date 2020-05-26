const MoveCreatePersonSearchResultsController = require('../../../move/controllers/create/person-search-results')

const PersonAssignBase = require('./base')

class PersonSearchResultsController extends PersonAssignBase {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setPeople)
    this.use(this.setPeopleItems)
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkFilter)
  }
}

PersonAssignBase.mixin(
  PersonSearchResultsController,
  MoveCreatePersonSearchResultsController
)

module.exports = PersonSearchResultsController
