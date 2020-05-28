const allocationService = require('../../../../common/services/allocation')

const PersonAssignBase = require('./base')

class ConfirmationController extends PersonAssignBase {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setUnassignedMove)
  }

  async setUnassignedMove(req, res, next) {
    try {
      const allocationId = res.locals.move.allocation.id

      const allocation = await allocationService.getById(allocationId)
      const unassignedMove =
        allocation.moves.filter(
          move => !move.person || move.person === null
        )[0] || {}

      res.locals.unassignedMoveId = unassignedMove.id
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ConfirmationController
