const { get, pick } = require('lodash')

const CreateMoveDetailsController = require('../create/move-details')

const UpdateBase = require('./base')

class UpdateMoveDetailsController extends UpdateBase {
  getUpdateValues(req, res) {
    const move = req.getMove()
    if (!move) {
      return {}
    }

    const values = pick(move, ['move_type'])
    if (values.move_type) {
      const toLocation = get(move, 'to_location.id')
      if (toLocation) {
        values[`to_location_${values.move_type}`] = toLocation
      }
    }

    return values
  }

  saveValues(req, res, next) {
    this.saveMove(req, res, next)
  }
}

UpdateBase.mixin(UpdateMoveDetailsController, CreateMoveDetailsController)

module.exports = UpdateMoveDetailsController
