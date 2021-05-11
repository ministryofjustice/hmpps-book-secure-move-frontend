const { find, set } = require('lodash')

const fieldHelpers = require('../../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../../common/helpers/reference-data')

const CreateBaseController = require('./base')

class PrisonTransferReasonController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.getPrisonTransferReason)
    this.use(this.setTransferReasonItems)
  }

  async getPrisonTransferReason(req, res, next) {
    try {
      req.prisonTransferReasons =
        await req.services.referenceData.getPrisonTransferReasons()

      next()
    } catch (error) {
      next(error)
    }
  }

  setTransferReasonItems(req, res, next) {
    const items = req.prisonTransferReasons
      .filter(referenceDataHelpers.filterDisabled())
      .map(fieldHelpers.mapReferenceDataToOption)

    set(req, 'form.options.fields.prison_transfer_type.items', items)

    next()
  }

  process(req, res, next) {
    const {
      prison_transfer_comments: comments,
      prison_transfer_type: transferTypeId,
    } = req.form.values

    req.form.values.prison_transfer_reason = find(req.prisonTransferReasons, {
      id: transferTypeId,
    })

    // TODO: possibly use a different value for this in the API?
    // store value in an attribute that will be captured to the API
    req.form.values.additional_information = comments

    next()
  }
}

module.exports = PrisonTransferReasonController
