const { formatISO, isValid, parseISO } = require('date-fns')
const { find, pick } = require('lodash')

const presenters = require('../../../../../common/presenters')
const componentService = require('../../../../../common/services/component')
const filters = require('../../../../../config/nunjucks/filters')

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
      const courtCases = await req.services.person.getActiveCourtCases(
        person.id
      )
      const { court_hearing__court_case: courtCaseField } =
        req.form.options.fields

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

  process(req, res, next) {
    const { court_hearing__start_time: startTime } = req.form.values

    if (startTime) {
      const moveDate = req.sessionModel.get('date')
      const hearingDate = parseISO(`${moveDate}T${startTime}`)
      req.form.values.court_hearing__start_time = isValid(hearingDate)
        ? formatISO(hearingDate)
        : startTime
    }

    next()
  }

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      if (err) {
        return callback(err)
      }

      const updatedValues = {
        ...values,
        court_hearing__start_time: filters.formatTime(
          values.court_hearing__start_time
        ),
      }

      callback(null, updatedValues)
    })
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
    const courtCase = find(req.courtCases, { id: courtCaseId })
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
        start_time: startTime,
      },
    ]

    super.saveValues(req, res, next)
  }
}

module.exports = CourtHearingsController
