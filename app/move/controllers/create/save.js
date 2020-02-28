const { omit, capitalize } = require('lodash')

const CreateBaseController = require('./base')
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const analytics = require('../../../../common/lib/analytics')

class SaveController extends CreateBaseController {
  async saveValues(req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])
      const move = await moveService.create(data)
      await personService.update(data.person)

      req.sessionModel.set('move', move)

      next()
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req, res, next) {
    const { id, from_location: fromLocation } = req.sessionModel.get('move')
    const journeyDuration = Math.round(
      new Date().getTime() - req.sessionModel.get('journeyTimestamp')
    )

    try {
      await analytics.sendJourneyTime({
        utv: capitalize(req.form.options.name),
        utt: journeyDuration,
        utc: capitalize(fromLocation.location_type),
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/move/${id}/confirmation`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = SaveController
