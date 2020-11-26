const { omit } = require('lodash')

const FormWizardController = require('../../../../common/controllers/form-wizard')
const populationService = require('../../../../common/services/population')

class DetailsController extends FormWizardController {
  setInitialValues(req, res, next) {
    if (req.journeyModel?.get('history').length === 1 && req.population) {
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
        await populationService.update({
          id: req.population.id,
          ...data,
          updated_by: 'user.fullname',
        })
      } else {
        await populationService.create(req.locationId, req.date, {
          ...data,
          updated_by: 'user.fullname',
        })
      }

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/population/day/${date}/${locationId}`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = DetailsController
