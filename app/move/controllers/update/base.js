const { get, keys } = require('lodash')

const personService = require('../../../../common/services/person')
const CreateBaseController = require('../create/base')

class UpdateBaseController extends CreateBaseController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setStepUrls)
    this.use(this.setInitialStep)
  }

  _setModels(req) {
    const res = req.res
    req.models.move = res.locals.move
    req.models.person = req.models.move.person
  }

  getBaseUrl(req) {
    const moveId = req.getMoveId()
    return `/move/${moveId}`
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = this.getBaseUrl(req)
    next()
  }

  setStepUrls(req, res, next) {
    const nextUrl = this.getBaseUrl(req)
    req.form.options.next = nextUrl
    req.form.options.backLink = nextUrl
    next()
  }

  setInitialStep(req, res, next) {
    let initialStep = false
    const referrer = req.get('referrer')
    if (!referrer) {
      initialStep = true
    } else {
      const { pathname } = new URL(referrer)
      if (pathname === req.form.options.backLink) {
        initialStep = true
      }
    }
    req.initialStep = initialStep
    next()
  }

  protectReadOnlyFields(req, values) {
    const fields = req.form.options.fields
    Object.keys(fields).forEach(key => {
      const field = fields[key]
      if (field.readOnly && values[key] !== undefined && values[key] !== null) {
        fields[key] = {
          ...field,
          ...field.updateComponent,
          value: values[key],
        }
      }
    })
  }

  getErrors(req, res) {
    if (req.initialStep) {
      return {}
    }
    return super.getErrors(req, res)
  }

  getValues(req, res, callback) {
    return super.getValues(req, res, (err, values) => {
      if (err) {
        return callback(err)
      }

      try {
        if (req.initialStep) {
          values = this.getUpdateValues(req)
        }
        this.protectReadOnlyFields(req, values)
      } catch (error) {
        return callback(error)
      }

      callback(null, values)
    })
  }

  getUpdateValues(req) {
    const person = req.getPerson()
    const fields = keys(get(req, 'form.options.fields'))
    return personService.unformat(person, fields)
  }
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
