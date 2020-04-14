const { get, keys } = require('lodash')
// const presenters = require('../../../../common/presenters')

const personService = require('../../../../common/services/person')
const CreateBaseController = require('../create/base')

class UpdateBaseController extends CreateBaseController {
  getMove(req, res) {
    return res.locals.move || {}
  }

  getPerson(req, res) {
    return get(this.getMove(req, res), 'person') || {}
  }

  getUpdateValues(req, res) {
    const person = this.getPerson(req, res)
    const fields = keys(get(req, 'form.options.fields'))
    return personService.unformat(person, fields)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = this.getUpdateBackStepUrl(req, res)
    next()
  }

  // setMoveSummary(req, res, next) {
  //   const move = this.getMove(req, res)
  //   res.locals.moveSummary = presenters.moveToMetaListComponent(move)
  //   res.locals.person = this.getPerson(req, res)

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
