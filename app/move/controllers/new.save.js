const { omit } = require('lodash')

const FormController = require('./new.form')
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
      await personService.update(data.person)

      req.sessionModel.set('move', move)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler (req, res) {
    const { date, person, to_location: toLocation } = req.sessionModel.get(
      'move'
    )

    req.journeyModel.reset()
    req.journeyModel.destroy()
    req.sessionModel.reset()
    req.sessionModel.destroy()

    req.flash('success', {
      title: req.t('messages::create_move.success.title'),
      content: req.t('messages::create_move.success.content', {
        name: personService.getFullname(person),
        location: toLocation.title,
        date: filters.formatDateWithDay(date),
      }),
    })

    res.redirect('/moves')
  }
}

module.exports = SaveController
