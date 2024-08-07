const { get, map, omitBy, set } = require('lodash')

const commonMiddleware = require('../../../../../common/middleware')
const locationService = require('../../../../../common/services/location')
const { FEATURE_FLAGS } = require('../../../../../config')

const CreateBaseController = require('./base')

class MoveDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setMoveTypes)
    this.use(
      commonMiddleware.setLocationItems(
        'approved_premises',
        'to_location_approved_premises',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'court',
        'to_location_court_appearance',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'prison',
        'to_location_prison_transfer',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'police',
        'to_location_police_transfer',
        'from_location'
      )
    )
    // hospitals come in 2 different flavours for obscure “legacy” reasons
    // book-a-secure-move makes no distinction between them
    // selecting a location from either results in a move_type of `hospital`
    this.use(
      commonMiddleware.setLocationItems(
        ['hospital', 'high_security_hospital'],
        'to_location_hospital',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'secure_childrens_home',
        'to_location_secure_childrens_home',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'secure_training_centre',
        'to_location_secure_training_centre',
        'from_location'
      )
    )
    this.use(
      commonMiddleware.setLocationItems(
        'police',
        'to_location_extradition',
        'from_location',
        true
      )
    )
  }

  isFromGivenLocationType(req, locationType) {
    const move = req.getMove()
    // location type is stored differently for new/edit actions
    return (
      move.from_location_type === locationType ||
      move.from_location?.location_type === locationType
    )
  }

  apMovesAllowed(req) {
    return this.isFromGivenLocationType(req, 'prison')
  }

  async extraditionMovesAllowed(req) {
    if (!FEATURE_FLAGS.EXTRADITION_MOVES) {
      return false
    }

    if (!this.isFromGivenLocationType(req, 'prison')) {
      return false
    }

    const location = await this.getMoveLocation(req)
    return location.extradition_capable
  }

  async getMoveLocation(req) {
    const move = req.getMove()
    const locationId = move.from_location?.id || move.from_location
    return await locationService.findById(req, locationId, true)
  }

  async setMoveTypes(req, res, next) {
    try {
      let permittedMoveTypes = get(req.session, 'user.permissions', [])
        .filter(permission => permission.includes('move:create:'))
        .map(permission => permission.replace('move:create:', ''))
        .filter(
          permission =>
            !(
              !this.isFromGivenLocationType(req, 'police') &&
              permission === 'prison_recall'
            )
        )

      if (permittedMoveTypes.includes('approved_premises')) {
        const canApMove = await this.apMovesAllowed(req)

        if (!canApMove) {
          permittedMoveTypes = permittedMoveTypes.filter(
            moveType => moveType !== 'approved_premises'
          )
        }
      }

      if (permittedMoveTypes.includes('extradition')) {
        const canExtradite = await this.extraditionMovesAllowed(req)

        if (!canExtradite) {
          permittedMoveTypes = permittedMoveTypes.filter(
            moveType => moveType !== 'extradition'
          )
        }
      }

      const existingItems = req.form.options.fields.move_type.items
      const permittedItems = existingItems.filter(item =>
        permittedMoveTypes.includes(item.value)
      )
      const removedConditionals = map(
        existingItems.filter(item => !permittedMoveTypes.includes(item.value)),
        'conditional'
      )

      // update move_type with only permitted items
      set(req, 'form.options.fields.move_type.items', permittedItems)

      // remove any conditionals fields that are no longer needed
      req.form.options.fields = omitBy(req.form.options.fields, (value, key) =>
        removedConditionals.includes(key)
      )

      next()
    } catch (error) {
      next(error)
    }
  }

  process(req, res, next) {
    const { move_type: moveType } = req.form.values
    const existingMoveType = req.sessionModel.get('move_type')

    // process locations
    req.form.values.to_location = req.form.values[`to_location_${moveType}`]

    if (moveType === 'prison_recall') {
      req.form.values.additional_information =
        req.form.values.prison_recall_comments
    } else if (moveType === 'video_remand') {
      req.form.values.additional_information =
        req.form.values.video_remand_comments
    } else if (
      existingMoveType === 'prison_recall' ||
      existingMoveType === 'video_remand'
    ) {
      req.form.values.additional_information = null
    }

    next()
  }

  async successHandler(req, res, next) {
    try {
      const { to_location: toLocationId } = req.sessionModel.toJSON()

      if (toLocationId) {
        const locationDetail =
          await req.services.referenceData.getLocationById(toLocationId)

        req.sessionModel.set('to_location', locationDetail)
        req.sessionModel.set('to_location_type', locationDetail.location_type)
      }

      super.successHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MoveDetailsController
