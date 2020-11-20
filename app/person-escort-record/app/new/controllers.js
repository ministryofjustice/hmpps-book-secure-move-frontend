const { get } = require('lodash')

const NewAssessmentController = require('../../../../common/controllers/framework/new-assessment')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

class NewPersonEscortRecordController extends NewAssessmentController {
  async saveValues(req, res, next) {
    try {
      req.record = await personEscortRecordService.create(req.move.id)
      next()
    } catch (err) {
      const apiErrorCode = get(err, 'errors[0].code')

      if (err.statusCode === 422 && apiErrorCode === 'taken') {
        return this.successHandler(req, res)
      }

      next(err)
    }
  }
}

module.exports = {
  NewPersonEscortRecordController,
}
