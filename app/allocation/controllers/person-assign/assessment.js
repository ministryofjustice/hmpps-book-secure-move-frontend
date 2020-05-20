const MoveCreateAssessmentController = require('../../../move/controllers/create/assessment')

const PersonAssignBase = require('./base')

class PersonAssessmentController extends PersonAssignBase {}

PersonAssignBase.mixin(
  PersonAssessmentController,
  MoveCreateAssessmentController
)

module.exports = PersonAssessmentController
