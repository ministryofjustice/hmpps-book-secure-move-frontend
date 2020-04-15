const { find, pick } = require('lodash')
const { formatISO, parseISO } = require('date-fns')

const CreateBaseController = require('./base')
const personService = require('../../../../common/services/person')
const courtHearingService = require('../../../../common/services/court-hearing')
const componentService = require('../../../../common/services/component')
const presenters = require('../../../../common/presenters')

class CourtHearingsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setCourtCaseItems)
  }

  async setCourtCaseItems(req, res, next) {
    const person = req.sessionModel.get('person') || {}

    if (!person.id) {
      return next()
    }

    try {
      const courtCases = await personService.getCourtCases(person.id)
      const {
        court_hearing__court_case: courtCaseField,
      } = req.form.options.fields

      courtCaseField.items = courtCases.map(courtCase => {
        const card = presenters.courtCaseToCardComponent(courtCase)
        return {
          html: componentService.getComponent('appCard', card),
          value: courtCase.nomis_case_id.toString(),
        }
      })

      req.courtCases = courtCases

      next()
    } catch (error) {
      // TODO: Handle different error cases better, ie invalid Prison number
      next()
    }
  }

  async saveValues(req, res, next) {
    // TODO: Remove once we support creating hearings without a case
    if (req.form.values.has_court_case === 'false') {
      return next()
    }

    const moveDate = req.sessionModel.get('date')
    const {
      court_hearing__comments: comments,
      court_hearing__court_case: courtCaseId,
      court_hearing__start_time: startTime,
    } = req.form.values
    const courtCase = find(req.courtCases, {
      id: courtCaseId,
    })

    try {
      const whitelistedCaseAttributes = pick(courtCase, [
        'nomis_case_id',
        'nomis_case_status',
        'case_number',
        'case_type',
        'case_start_date',
      ])
      const hearingDatetime = parseISO(`${moveDate}T${startTime}`)
      const courtHearing = await courtHearingService.create({
        ...whitelistedCaseAttributes,
        comments,
        start_time: formatISO(hearingDatetime),
      })

      req.form.values.court_hearings = [courtHearing]

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  // TODO: Remove once court hearings are fully released
  canAccessCourtHearings(isEnabled) {
    return req => {
      return (
        req.sessionModel.get('from_location_type') === 'prison' && isEnabled
      )
    }
  }
}

module.exports = CourtHearingsController
