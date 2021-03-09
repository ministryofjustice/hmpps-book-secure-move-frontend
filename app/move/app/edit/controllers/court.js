const AssessmentController = require('./assessment')

class UpdateCourtController extends AssessmentController {
  // TODO: replace this with a centralised more form-wizard-based protection
  configure(req, res, next) {
    const isCourt = req.move?.to_location?.location_type === 'court'

    if (!isCourt) {
      const error = new Error(
        'Updating court information is not possible for this move'
      )
      error.statusCode = 404

      return next(error)
    }

    super.configure(req, res, next)
  }
}

module.exports = UpdateCourtController
