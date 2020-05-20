const CreateBaseController = require('../../../move/controllers/create/base')

class CreateAllocationBaseController extends CreateBaseController {
  middlewareLocals() {
    CreateBaseController.prototype.middlewareLocals.apply(this)
    this.use(this.setCancelUrl)
    this.use(this.setMove)
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
      req.sessionModel.set('move', emptySlotMove)
    }

    res.locals.person = req.sessionModel.get('person')
    res.locals.move = req.sessionModel.get('move')
    res.locals.addAnother = !!emptySlotMove

    // console.log('AAAAAAAAARGHHH', { moveAgreed, moveAgreedBy })
    // console.log(JSON.stringify(req.sessionModel.toJSON(), null, 2))
    // const move = res.locals.move
    // const originalPerson = move.person || {}
    // console.log(JSON.stringify({ move, originalPerson }, null, 2))

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
