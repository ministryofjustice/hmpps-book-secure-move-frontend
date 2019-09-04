const { omit } = require('lodash')

const CreateBaseController = require('./base')
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')

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

  successHandler(req, res) {
    const { id } = req.sessionModel.get('move')

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${id}/confirmation`)
  }
}

module.exports = SaveController
