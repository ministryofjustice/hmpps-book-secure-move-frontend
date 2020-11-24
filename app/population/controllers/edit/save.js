const { omit } = require('lodash')

const populationService = require('../../../../common/services/population')

const PopulationBaseController = require('./base')

class SaveController extends PopulationBaseController {
  async saveValues(req, res, next) {
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

      next()
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req, res, next) {
    const { date, locationId } = req

    try {
      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/population/day/${date}/${locationId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = SaveController
