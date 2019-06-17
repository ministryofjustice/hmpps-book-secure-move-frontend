const { omit } = require('lodash')

const FormController = require('./form')
const moveService = require('../../../common/services/move')

class SaveController extends FormController {
  async saveValues (req, res, next) {
    try {
      const data = req.sessionModel.toJSON()
      const cleaned = omit(data, ['csrf-secret', 'errors', 'errorValues'])
      const locationType = cleaned.to_location_type

      const move = await moveService.createMove(Object.assign({}, cleaned, {
        move_type: 'court',
        time_due: '2019-06-10T17:02:15.929Z',
        status: 'requested',
        to_location: {
          id: cleaned[`to_location_${locationType}`],
        },
        from_location: {
          id: cleaned[`to_location_${locationType}`],
        },
      }))

      req.sessionModel.set('moveId', move.id)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler (req, res) {
    req.journeyModel.reset()
    req.journeyModel.destroy()
    req.sessionModel.reset()
    req.sessionModel.destroy()

    res.redirect(`/`)
  }
}

module.exports = SaveController
