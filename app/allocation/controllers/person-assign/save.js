const { get, omit } = require('lodash')

const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const MoveCreateSaveController = require('../../../move/controllers/create/save')

const PersonAssignBase = require('./base')

class SaveController extends PersonAssignBase {
  async saveValues(req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])

      const move = await moveService.update({
        ...data,
        id: data.move.id,
        person: data.person.id,
      })

      await personService.update({
        ...data.person,
        assessment_answers: data.assessment,
      })

      req.sessionModel.set('move', move)

      next()
    } catch (err) {
      next(err)
    }
  }

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')

      return res.render('allocation/views/person-assign/assign-conflict', {
        existingMoveId,
      })
    }

    super.errorHandler(err, req, res, next)
  }

  successHandler(req, res, next) {
    super.successHandler(req, res, next)
  }
}

PersonAssignBase.mixin(SaveController, MoveCreateSaveController)

module.exports = SaveController
