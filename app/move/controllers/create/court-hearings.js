const { formatISO, parseISO } = require('date-fns')
const { find, pick } = require('lodash')

const presenters = require('../../../../common/presenters')
const componentService = require('../../../../common/services/component')
const personService = require('../../../../common/services/person')

const CreateBaseController = require('./base')

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
      const courtCases = await personService.getActiveCourtCases(person.id)
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

  saveValues(req, res, next) {
    // TODO: Remove once we support creating hearings without a case
    if (req.form.values.has_court_case === 'false') {
      return super.saveValues(req, res, next)
    }

    const {
      court_hearing__comments: comments,
      court_hearing__court_case: courtCaseId,
      court_hearing__start_time: startTime,
    } = req.form.values
    const moveDate = req.sessionModel.get('date')
    const courtCase = find(req.courtCases, { id: courtCaseId })
    const hearingDatetime = parseISO(`${moveDate}T${startTime}`)
    const whitelistedCaseAttributes = pick(courtCase, [
      'nomis_case_id',
      'nomis_case_status',
      'case_number',
      'case_type',
      'case_start_date',
    ])

    req.form.values.court_hearings = [
      {
        ...whitelistedCaseAttributes,
        comments,
        start_time: formatISO(hearingDatetime),
      },
    ]

    super.saveValues(req, res, next)
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
