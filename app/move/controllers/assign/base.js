const { pick } = require('lodash')

const presenters = require('../../../../common/presenters')
const CreateBaseController = require('../create/base')

class AssignBaseController extends CreateBaseController {
  middlewareLocals() {
    this.use(this.setMove)
    CreateBaseController.prototype.middlewareLocals.apply(this)
    this.use(this.setCancelUrl)
  }

  setCancelUrl(req, res, next) {
    const allocationId = res.locals.move.allocation.id
    res.locals.cancelUrl = `/allocation/${allocationId}`
    next()
  }

  setMoveSummary(req, res, next) {
    const currentLocation = req.session.currentLocation
    // TODO remove pick when the api return move_agreed as null
    // unless of course further unwanted properties have been added in the meantime
    const moveSubset = pick(res.locals.move, ['to_location', 'date'])
    res.locals.moveSummary = presenters.moveToMetaListComponent({
      ...moveSubset,
      from_location: currentLocation,
    })
    next()
  }

  setMove(req, res, next) {
    const person = req.sessionModel.get('person')
    res.locals.person = person

    const move = req.sessionModel.get('move') || res.locals.move
    req.sessionModel.set('move', move)

    // TODO: when req.getMove et al are removed these can be zapped
    res.locals.move = move
    req.models.move = move
    req.models.person = person

    next()
  }
}

AssignBaseController.mixin = function mixin(controller, mixinController) {
  const controllerMethods = Object.getOwnPropertyNames(controller.prototype)
  Object.getOwnPropertyNames(mixinController.prototype)
    .filter(key => key !== 'prototype')
    .forEach(key => {
      if (!controllerMethods.includes(key)) {
        controller.prototype[key] = mixinController.prototype[key]
      }
    })
}

module.exports = AssignBaseController
