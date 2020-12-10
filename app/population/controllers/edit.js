const { omit } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')

class DetailsController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setCancelUrl)
    this.use(this.setPageTitle)
  }

  setInitialValues(req, res, next) {
    if (req.form.options.fullPath !== req.journeyModel.get('lastVisited')) {
      const values = omit(req.population, ['moves_from', 'moves_to'])
      req.sessionModel.set(values)
    }

    next()
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
}
module.exports = DetailsController
