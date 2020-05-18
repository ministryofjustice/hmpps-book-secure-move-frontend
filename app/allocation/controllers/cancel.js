const FormWizardController = require('../../../common/controllers/form-wizard')
const allocationService = require('../../../common/services/allocation')

class CancelController extends FormWizardController {
  async successHandler(req, res, next) {
    const { id: allocationId } = res.locals.allocation

    try {
      await allocationService.cancel(allocationId)

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${allocationId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CancelController
