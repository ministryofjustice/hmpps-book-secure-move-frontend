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

      const unassignedMoves = allocation.moves.filter(move => !move.person)
      const unassignedMoveId = unassignedMoves.length
        ? unassignedMoves[0].id
        : undefined

      res.locals.unassignedMoveId = unassignedMoveId
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ConfirmationController
