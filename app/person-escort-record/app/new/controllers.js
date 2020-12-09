const { get } = require('lodash')

const NewAssessmentController = require('../../../../common/controllers/framework/new-assessment')

class NewPersonEscortRecordController extends NewAssessmentController {
  async saveValues(req, res, next) {
    try {
      req.record = await req.services.personEscortRecord.create(req.move.id)
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
