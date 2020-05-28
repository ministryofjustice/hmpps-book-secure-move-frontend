const allocationService = require('../../../../common/services/allocation')

const PersonAssignBase = require('./base')

class ConfirmationController extends PersonAssignBase {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setAssignNext)
  }

  async setAssignNext(req, res, next) {
    try {
      const allocationId = res.locals.move.allocation.id

      const allocation = await allocationService.getById(allocationId)
      const unfilledMove =
        allocation.moves.filter(
          move => !move.person || move.person === null
        )[0] || {}

      res.locals.assignNext = unfilledMove.id
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ConfirmationController
