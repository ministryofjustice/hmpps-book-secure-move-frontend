const { omit } = require('lodash')

const allocationService = require('../../../../common/services/allocation')

const CreateAllocationBaseController = require('./base')

class SaveController extends CreateAllocationBaseController {
  async saveValues(req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])
      const allocation = await allocationService.create(data)

      req.sessionModel.set('allocation', allocation)

      next()
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req, res, next) {
    const { id } = req.sessionModel.get('allocation')

    try {
      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${id}/confirmation`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = SaveController
