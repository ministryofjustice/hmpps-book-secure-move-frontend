const { get, pick } = require('lodash')

const moveService = require('../../../../common/services/move')
const CreateMoveDetailsController = require('../create/move-details')

const UpdateBase = require('./base')

class UpdateMoveDetailsController extends UpdateBase {
  middlewareSetup() {
    CreateMoveDetailsController.prototype.middlewareSetup.apply(this)
    this.use(this.filterMoveTypes)
  }

  getUpdateValues(req, res) {
    const move = req.getMove()
    if (!move) {
      return {}
    }

    const values = pick(move, ['move_type', 'additional_information'])

    const moveType = move.move_type
    if (values.additional_information) {
      values[`${moveType}_comments`] = values.additional_information
    }
    const toLocation = get(move, 'to_location.id')
    if (toLocation) {
      values[`to_location_${moveType}`] = toLocation
    }

    return values
  }

  filterMoveTypes(req, res, next) {
    const move = req.getMove()
    const moveType = move.move_type
    const moveTypeField = get(req, 'form.options.fields.move_type')
    moveTypeField.items = moveTypeField.items.filter(
      item => item.value === moveType
    )
    next()
  }

  async saveValues(req, res, next) {
    try {
      const moveId = req.getMoveId()
      const { values } = req.form
      const move = req.getMove()
      const moveType = move.move_type
      const toLocation = values[`to_location_${moveType}`]
      const additionalInformation = values[`${moveType}_comments`]

      if (toLocation !== get(move, 'to_location.id')) {
        const notes = req.t('moves::redirect_notes', req.session.user)

        await moveService.redirect({
          id: moveId,
          notes,
          to_location: {
            id: toLocation,
          },
        })
      } else if (additionalInformation !== move.additional_information) {
        await moveService.update({
          id: moveId,
          additional_information: additionalInformation,
        })
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

UpdateBase.mixin(UpdateMoveDetailsController, CreateMoveDetailsController)

module.exports = UpdateMoveDetailsController
