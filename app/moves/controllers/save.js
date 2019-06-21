const { omit } = require('lodash')

const FormController = require('./form')
const moveService = require('../../../common/services/move')
const personService = require('../../../common/services/person')
const filters = require('../../../config/nunjucks/filters')

class SaveController extends FormController {
  async saveValues (req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])

      const move = await moveService.create(data)
      req.sessionModel.set('move', move)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler (req, res) {
    const {
      date,
      person,
      to_location: toLocation,
    } = req.sessionModel.get('move')
    const messageContent = `Move for <strong>${personService.getFullname(person)}</strong> to <strong>${toLocation.title}</strong> on <strong>${filters.formatDateWithDay(date)}</strong> has been scheduled.`

    req.journeyModel.reset()
    req.journeyModel.destroy()
    req.sessionModel.reset()
    req.sessionModel.destroy()

    req.flash('success', {
      title: 'Move scheduled',
      content: messageContent,
    })

    res.redirect('/')
  }
}

module.exports = SaveController
