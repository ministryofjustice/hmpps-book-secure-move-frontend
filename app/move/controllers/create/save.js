const { omit, capitalize, flatten, values, some } = require('lodash')

const CreateBaseController = require('./base')
const courtHearingService = require('../../../../common/services/court-hearing')
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const analytics = require('../../../../common/lib/analytics')

function filterAnswer(currentAssessment, searchKey) {
  return item => {
    if (
      !some(currentAssessment, { key: searchKey }) &&
      item.key === searchKey
    ) {
      return false
    }
    return true
  }
}

class SaveController extends CreateBaseController {
  async saveValues(req, res, next) {
    try {
      const data = omit(req.sessionModel.toJSON(), [
        'csrf-secret',
        'errors',
        'errorValues',
      ])
      const move = await moveService.create(data)

      await Promise.all([
        // update person
        personService.update({
          ...data.person,
          assessment_answers: data.assessment,
        }),
        // create hearings
        ...data.court_hearings.map(hearing =>
          courtHearingService.create({
            ...hearing,
            move: move.id,
          })
        ),
      ])

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
}

module.exports = SaveController
