const { get, omit, capitalize, flatten, values, some } = require('lodash')

const analytics = require('../../../../common/lib/analytics')
const courtHearingService = require('../../../../common/services/court-hearing')
const moveService = require('../../../../common/services/move')
const profileService = require('../../../../common/services/profile')

const CreateBaseController = require('./base')

function filterAnswer(currentAssessment, searchKey) {
  return item => {
    return !(
      !some(currentAssessment, { key: searchKey }) && item.key === searchKey
    )
  }
}

class SaveController extends CreateBaseController {
  async saveValues(req, res, next) {
    try {
      const sessionData = req.sessionModel.toJSON()
      const person = sessionData.person
      const assessment = sessionData.assessment
      const documents = sessionData.documents
      const data = omit(sessionData, [
        'csrf-secret',
        'errors',
        'errorValues',
        'assessment',
        'documents',
        'person',
      ])

      const profile = await profileService.create(person.id, {
        // TODO: reinstate when move to v2
        // assessment_answers: assessment,
        // documents,
      })

      const moveData = {
        ...data,
        profile,
      }

      const move = await moveService.create(moveData)

      await Promise.all([
        // create hearings
        ...(data.court_hearings || []).map(hearing =>
          courtHearingService.create(
            {
              ...hearing,
              move: move.id,
            },
            data.should_save_court_hearings === 'false'
          )
        ),
      ])

      // TODO: remove when v2
      await profileService.update({
        ...profile,
        assessment_answers: assessment,
        documents,
      })
      // TODO: end remove when v2

      req.sessionModel.set('move', move)

      next()
    } catch (error) {
      next(error)
    }
  }

  process(req, res, next) {
    const {
      person,
      assessment,
      from_location_type: fromLocationType,
      to_location_type: toLocationType,
    } = req.form.values
    const currentAssessment = flatten(values(assessment))

    if (fromLocationType === 'prison' && toLocationType === 'prison') {
      req.sessionModel.set('status', 'proposed')
    }

    if (fromLocationType !== 'prison') {
      req.sessionModel.set('assessment', currentAssessment)
      return super.process(req, res, next)
    }

    const existingAssessment = person.assessment_answers
      // keep all existing NOMIS alerts
      .filter(answer => answer.nomis_alert_code)
      // filter out requested answers
      .filter(filterAnswer(currentAssessment, 'not_to_be_released'))
      .filter(filterAnswer(currentAssessment, 'special_vehicle'))

    req.sessionModel.set('assessment', [
      ...existingAssessment,
      ...currentAssessment,
    ])

    super.process(req, res, next)
  }

  async successHandler(req, res, next) {
    const { id, from_location: fromLocation } = req.sessionModel.get('move')
    const journeyDuration = Math.round(
      new Date().getTime() - req.sessionModel.get('journeyTimestamp')
    )

    try {
      await analytics.sendJourneyTime({
        utv: capitalize(req.form.options.name),
        utt: journeyDuration,
        utc: capitalize(fromLocation.location_type),
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/move/${id}/confirmation`)
    } catch (err) {
      next(err)
    }
  }

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')

      return res.render('move/views/create/save-conflict', {
        existingMoveId,
      })
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = SaveController
