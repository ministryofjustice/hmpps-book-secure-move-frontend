const CreateBaseController = require('../create/base')

class CreateAllocationBaseController extends CreateBaseController {
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

  setMove(req, res, next) {
    const { move } = res.locals
    const person = req.sessionModel.get('person')

    if (!req.sessionModel.get('move')) {
      req.sessionModel.set('move', move)
    }

    res.locals.person = person

    // TODO: when req.getMove et al are removed these can be zapped
    req.models.move = move
    req.models.person = person

    next()
  }
}

CreateAllocationBaseController.mixin = function mixin(
  controller,
  mixinController
) {
  const controllerMethods = Object.getOwnPropertyNames(controller.prototype)
  Object.getOwnPropertyNames(mixinController.prototype)
    .filter(key => key !== 'prototype')
    .forEach(key => {
      if (!controllerMethods.includes(key)) {
        controller.prototype[key] = mixinController.prototype[key]
      }
    })
}

module.exports = CreateAllocationBaseController
