const { get, keys } = require('lodash')
// const presenters = require('../../../../common/presenters')

const personService = require('../../../../common/services/person')
const CreateBaseController = require('../create/base')

class UpdateBaseController extends CreateBaseController {
  _setModels(req) {
    const res = req.res
    req.models.move = res.locals.move
    req.models.person = req.models.move.person
  }

  getUpdateValues(req, res) {
    const person = req.getPerson()
    const fields = keys(get(req, 'form.options.fields'))
    return personService.unformat(person, fields)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = this.getUpdateBackStepUrl(req, res)
    next()
  }

  // setMoveSummary(req, res, next) {
  //   const move = req.getMove()
  //   res.locals.moveSummary = presenters.moveToMetaListComponent(move)
  //   res.locals.person = req.getPerson()

  //   next()
  // }
}

UpdateBaseController.mixin = function mixin(controller, mixinController) {
  const controllerMethods = Object.getOwnPropertyNames(controller.prototype)
  Object.getOwnPropertyNames(mixinController.prototype)
    .filter(key => key !== 'prototype')
    .forEach(key => {
      if (!controllerMethods.includes(key)) {
        controller.prototype[key] = mixinController.prototype[key]
      }
    })
}

module.exports = UpdateBaseController
