const { omit } = require('lodash')

const CreateAllocationBaseController = require('./base')

class SaveController extends CreateAllocationBaseController {
  async saveValues(req, res, next) {
    try {
      const sessionModel = req.sessionModel.toJSON()
      const data = omit(sessionModel, ['csrf-secret', 'errors', 'errorValues'])

      const allocation = await req.services.allocation.create({
        ...data,
        requested_by: req.session.user.fullname,
      })

      req.sessionModel.set('allocation', allocation)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req, res, next) {
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
