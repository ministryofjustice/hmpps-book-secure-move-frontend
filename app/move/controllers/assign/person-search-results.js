const MoveCreatePersonSearchResultsController = require('../../../move/controllers/create/person-search-results')

const AssignBaseController = require('./base')

class PersonSearchResultsController extends AssignBaseController {
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

AssignBaseController.mixin(
  PersonSearchResultsController,
  MoveCreatePersonSearchResultsController
)

module.exports = PersonSearchResultsController
