const MoveCreatePersonSearchController = require('../../../move/controllers/create/person-search')

const AssignBaseController = require('./base')

class PersonSearchController extends AssignBaseController {}

AssignBaseController.mixin(
  PersonSearchController,
  MoveCreatePersonSearchController
)

module.exports = PersonSearchController
