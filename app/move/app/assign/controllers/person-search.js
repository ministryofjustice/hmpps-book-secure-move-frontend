const MoveCreatePersonSearchController = require('../../new/controllers/person-search')

const AssignBaseController = require('./base')

class PersonSearchController extends AssignBaseController {}

AssignBaseController.mixin(
  PersonSearchController,
  MoveCreatePersonSearchController
)

module.exports = PersonSearchController
