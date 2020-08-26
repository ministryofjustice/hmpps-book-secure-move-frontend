const { isEqual, keys, pick } = require('lodash')

const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const CreateBaseController = require('../create/base')

class UpdateBaseController extends CreateBaseController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setNextStep)
    this.use(this.setInitialStep)
  }

  _setModels(req) {
    const move = req.move
    req.models.move = move
    req.models.profile = move.profile
    req.models.person = move.profile.person
  }

  getBaseUrl(req) {
    const moveId = req.getMoveId()
    return `/move/${moveId}`
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = this.getBaseUrl(req)
    next()
  }

  setNextStep(req, res, next) {
    const nextUrl = this.getBaseUrl(req)
    req.form.options.next = nextUrl
    next()
  }

  setInitialStep(req, res, next) {
    let initialStep = false
    const referrer = req.get('referrer')

    if (!referrer) {
      initialStep = true
    } else {
      const { pathname } = new URL(referrer)

      if (pathname === this.getBaseUrl(req)) {
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
        const initialValues = this.getUpdateValues(req, res)

        if (req.initialStep) {
          values = initialValues
        }

        this.protectReadOnlyFields(req, initialValues)
      } catch (error) {
        return callback(error)
      }

      callback(null, values)
    })
  }

  getUpdateValues(req, res) {
    const person = req.getPerson()
    const fields = keys(req.form?.options?.fields)
    return personService.unformat(person, fields)
  }

  async saveMove(req, res, next) {
    try {
      const fields = this.saveFields || Object.keys(req.form.options.fields)
      const newValues = pick(req.form.values, fields)
      const oldValues = pick(req.getMove(), fields)

      if (!isEqual(newValues, oldValues)) {
        const id = req.getMoveId()
        const data = {
          id,
          ...newValues,
        }

        const updatedMove = await moveService.update(data)
        req.move = updatedMove
        this._setModels(req)
        this.setFlash(req)
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  setFlash(req, category) {
    const move = req.getMove()
    const supplier = move.supplier?.name || req.t('supplier_fallback')
    category = category || this.flashKey || req.form.options.key
    req.flash('success', {
      title: req.t(`moves::update_flash.categories.${category}.heading`),
      content: req.t(`moves::update_flash.categories.${category}.message`, {
        supplier,
      }),
    })
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
