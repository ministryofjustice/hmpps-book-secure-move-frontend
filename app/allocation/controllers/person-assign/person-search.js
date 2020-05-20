const MoveCreatePersonSearchController = require('../../../move/controllers/create/person-search')

const PersonAssignBase = require('./base')

class PersonSearchController extends PersonAssignBase {}

PersonAssignBase.mixin(PersonSearchController, MoveCreatePersonSearchController)

module.exports = PersonSearchController
