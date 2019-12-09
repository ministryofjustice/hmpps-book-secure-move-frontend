const { omit } = require('lodash')

const CreateBaseController = require('./base')
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')

class SaveController extends CreateBaseController {
  saveMove(id, data) {
    if (id) {
      return moveService.update({
        id,
        ...data,
      })
    }

    return moveService.create(data)
  }

  async saveValues(req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])
      const { id } = req.sessionModel.get('move') || {}
      const move = await this.saveMove(id, data)
      await personService.update(data.person)

      req.sessionModel.set('move', move)

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = SaveController
