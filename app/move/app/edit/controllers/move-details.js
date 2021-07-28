const { omitBy, pick } = require('lodash')

const CreateMoveDetailsController = require('../../new/controllers/move-details')

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

    const toLocation = move.to_location?.id

    if (toLocation) {
      values[`to_location_${moveType}`] = toLocation
    }

    return values
  }

  filterMoveTypes(req, res, next) {
    const move = req.getMove()
    const moveType = move.move_type
    const moveTypeField = req.form.options.fields?.move_type
    moveTypeField.items = moveTypeField.items.filter(
      item => item.value === moveType
    )

    // remove any fields that are no longer needed
    req.form.options.fields = omitBy(req.form.options.fields, (value, key) => {
      return (
        (key.startsWith('to_location_') || key.endsWith('_comments')) &&
        !key.includes(moveType)
      )
    })

    next()
  }

  process(req, res, next) {
    const { move_type: moveType } = req.form.values

    req.form.values.to_location = req.form.values[`to_location_${moveType}`]
    req.form.values.additional_information =
      req.form.values[`${moveType}_comments`]

    next()
  }

  async saveValues(req, res, next) {
    try {
      const move = req.getMove()
      const moveId = req.getMoveId()
      const {
        additional_information: additionalInformation,
        to_location: toLocation,
      } = req.form.values

      if (toLocation !== undefined && toLocation !== move.to_location?.id) {
        const notes = req.t('moves::redirect_notes', req.session.user)

        await req.services.move.redirect({
          id: moveId,
          notes,
          to_location: {
            id: toLocation,
          },
        })
      }

      if (
        // API can return null or string for additional_information
        // form value can be string or undefined depending on move type
        additionalInformation !== undefined &&
        additionalInformation !== move.additional_information
      ) {
        await req.services.move.update({
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
