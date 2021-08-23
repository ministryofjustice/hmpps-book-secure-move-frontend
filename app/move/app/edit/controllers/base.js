const { get, isEqual, keys, pick } = require('lodash')

const filters = require('../../../../../config/nunjucks/filters')
const CreateBaseController = require('../../new/controllers/base')

class UpdateBaseController extends CreateBaseController {
  middlewareChecks() {
    this.use(this.canEdit)
    super.middlewareChecks()
  }

  canEdit(req, res, next) {
    const { id, _hasLeftCustody } = req.move

    if (_hasLeftCustody) {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setNextStep)
    this.use(this.setInitialStep)
  }

  _setModels(req) {
    const move = req.move
    req.models.move = move
    req.models.profile = move.profile
    req.models.person = move.profile?.person
  }

  getBaseUrl(req) {
    const moveId = req.getMoveId()
    return `/move/preview/${moveId}/details`
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
    return req.services.person.unformat(person, fields)
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

        await req.services.move.update(data)
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

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')
      const move = {
        ...req.getMove(),
        ...req.form.values,
      }

      return res.render('action-prevented', {
        backLink: `/move/${move.id}`,
        pageTitle: req.t('validation::move_conflict.heading', {
          context: 'update',
        }),
        message: req.t('validation::move_conflict.message', {
          context: 'update',
          href: `/move/${existingMoveId}`,
          name: move.profile.person._fullname,
          date: filters.formatDateWithDay(move.date),
        }),
        instruction: req.t('validation::move_conflict.instructions', {
          date_href: `/move/${move.id}/edit/move-date`,
          location_href: `/move/${move.id}/edit/move-details`,
        }),
      })
    }

    super.errorHandler(err, req, res, next)
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
