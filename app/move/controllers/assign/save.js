const { get, omit } = require('lodash')

const moveService = require('../../../../common/services/move')
const filters = require('../../../../config/nunjucks/filters')
const MoveCreateSaveController = require('../create/save')

const PersonAssignBase = require('./base')

class SaveController extends PersonAssignBase {
  async saveValues(req, res, next) {
    const profileService = req.services.profile

    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])

      const profile = await profileService.create(data.person.id, {
        assessment_answers: data.assessment,
      })

      const move = await moveService.update({
        ...data,
        id: data.move.id,
        profile,
      })

      req.sessionModel.set('moveId', move.id)

      next()
    } catch (err) {
      next(err)
    }
  }

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')
      const person = req.sessionModel.get('person')

      return res.render('action-prevented', {
        pageTitle: req.t('validation::assign_conflict.heading'),
        message: req.t('validation::assign_conflict.message', {
          href: `/move/${existingMoveId}`,
          name: person._fullname,
          location: req.move.allocation.to_location.title,
          date: filters.formatDateWithDay(req.move.date),
        }),
        instruction: req.t('validation::assign_conflict.instructions', {
          assign_href: `/move/${req.move.id}/assign`,
        }),
      })
    }

    super.errorHandler(err, req, res, next)
  }

  successHandler(req, res) {
    const moveId = req.sessionModel.get('moveId')

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${moveId}/confirmation`)
  }
}

PersonAssignBase.mixin(SaveController, MoveCreateSaveController)

module.exports = SaveController
