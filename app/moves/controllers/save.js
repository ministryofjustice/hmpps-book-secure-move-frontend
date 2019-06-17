const { omit } = require('lodash')

const FormController = require('./form')
const moveService = require('../../../common/services/move')

class SaveController extends FormController {
  async saveValues (req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])

      await moveService.create(data)

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

    res.redirect('/')
  }
}

module.exports = SaveController
