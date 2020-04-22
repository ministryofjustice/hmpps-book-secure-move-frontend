const { get, pick } = require('lodash')

const moveService = require('../../../../common/services/move')
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

  async saveValues(req, res, next) {
    try {
      const id = req.getMoveId()
      const data = {
        id,
        ...pick(get(req, 'form.values'), ['move_type', 'to_location']),
      }
      // TODO; short-circuit if no need to update
      await moveService.update(data)

      // no need to call super
      next()
    } catch (error) {
      next(error)
    }
  }
}

UpdateBase.mixin(UpdateMoveDetailsController, CreateMoveDetailsController)

module.exports = UpdateMoveDetailsController
