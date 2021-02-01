const { isNil, omit, mapValues } = require('lodash')

const FormWizardController = require('../../../../common/controllers/form-wizard')

class DetailsController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()

    this.use(this.setBreadcrumbs)
    this.use(this.setCancelUrl)
    this.use(this.setPageTitle)
    this.use(this.setHintText)
  }

  async successHandler(req, res, next) {
    const { date, locationId } = req

    try {
      const sessionModel = req.sessionModel.toJSON()
      const data = omit(sessionModel, ['csrf-secret', 'errors', 'errorValues'])

      if (req.population) {
        await req.services.population.update({
          id: req.population.id,
          ...data,
          updated_by: req.session.user.fullname,
        })
      } else {
        await req.services.population.create({
          location: req.locationId,
          date: req.date,
          ...data,
          updated_by: req.session.user.fullname,
        })
      }

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/population/day/${date}/${locationId}`)
    } catch (err) {
      next(err)
    }
  }

  setBreadcrumbs(req, res, next) {
    const breadcrumbText = req.population
      ? 'population::edit.page_title_update'
      : 'population::edit.page_title_new'

    res.breadcrumb({
      text: req.t(breadcrumbText),
      href: '',
    })

    next()
  }

  setCancelUrl(req, res, next) {
    if (req.population) {
      res.locals.cancelUrl = `/population/day/${req.date}/${req.locationId}`
    } else {
      res.locals.cancelUrl = `/population/week/${req.date}`
    }

    next()
  }

  setPageTitle(req, res, next) {
    req.form.options.pageTitle = req.population
      ? 'population::edit.page_title_update'
      : 'population::edit.page_title_new'

    next()
  }

  setHintText(req, res, next) {
    if (!req.population) {
      const { unlock, discharges } = req.sessionModel.options.fields

      unlock.hint = unlock.hint || {}
      unlock.hint.text = req.t('messages::external_data.nomis')

      discharges.hint = discharges.hint || {}
      discharges.hint.text = req.t('messages::external_data.nomis')
    }

    next()
  }

  stringifyValues({ fields, values }) {
    return mapValues(values, (item, key) => {
      if (fields[key] && fields[key].inputmode === 'numeric') {
        if (isNil(item)) {
          return ''
        } else {
          return item.toString()
        }
      }

      return item
    })
  }

  getValues(req, res, cb) {
    super.getValues(req, res, (err, values) => {
      if (err) {
        return cb(err, values)
      }

      const stringedValues = this.stringifyValues({
        fields: req.form.options.fields,
        values,
      })

      return cb(err, stringedValues)
    })
  }
}
module.exports = DetailsController
