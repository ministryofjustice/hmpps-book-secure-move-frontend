const { omit } = require('lodash')

const populationService = require('../../../../common/services/population')

const EditPopulationBaseController = require('./base')

class DetailsController extends EditPopulationBaseController {
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
