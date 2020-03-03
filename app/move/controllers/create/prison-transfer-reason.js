const { set } = require('lodash')
const CreateBaseController = require('./base')
const referenceDataService = require('../../../../common/services/reference-data')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')
const fieldHelpers = require('../../../../common/helpers/field')

class PrisonTransferReasonController extends CreateBaseController {
  async configure(req, res, next) {
    try {
      const reasons = await referenceDataService.getPrisonTransferReasons()
      const reasonsItems = reasons
        .filter(referenceDataHelpers.filterDisabled())
        .map(fieldHelpers.mapReferenceDataToOption)

      set(req, 'form.options.fields.prison_transfer_reason.items', reasonsItems)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PrisonTransferReasonController
