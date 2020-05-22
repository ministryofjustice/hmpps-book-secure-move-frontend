const CreateBaseController = require('../../../move/controllers/create/base')

class CreateAllocationBaseController extends CreateBaseController {
  middlewareLocals() {
    this.use(this.setMove)
    CreateBaseController.prototype.middlewareLocals.apply(this)
    this.use(this.setCancelUrl)
  }

  setCancelUrl(req, res, next) {
    const allocationId = res.locals.allocation.id
    res.locals.cancelUrl = `/allocation/${allocationId}`
    next()
  }

  setMove(req, res, next) {
    const { allocation } = res.locals

    const emptySlotMove = allocation.moves.filter(move => !move.person)[0]

    if (!emptySlotMove) {
      if (req.form.options.route !== '/confirmation') {
        return res.redirect(res.locals.cancelUrl)
      }
    } else {
      if (!req.sessionModel.get('move')) {
        req.sessionModel.set('move', emptySlotMove)
      }
    }

    res.locals.person = req.sessionModel.get('person')
    res.locals.move = req.sessionModel.get('move')
    res.locals.addAnother = !!emptySlotMove

    // TODO: when req.getMove et al are removed these can be zapped
    req.models.move = res.locals.move
    req.models.person = res.locals.person

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
