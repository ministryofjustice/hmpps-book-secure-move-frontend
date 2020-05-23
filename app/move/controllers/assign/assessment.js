const MoveCreateAssessmentController = require('../../../move/controllers/create/assessment')

const PersonAssignBase = require('./base')

class PersonAssessmentController extends PersonAssignBase {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setPreviousAssessment)
  }
}

PersonAssignBase.mixin(
  PersonAssessmentController,
  MoveCreateAssessmentController
)

module.exports = PersonAssessmentController
