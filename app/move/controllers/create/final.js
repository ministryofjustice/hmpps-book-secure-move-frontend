const CreateBaseController = require('./base')

class FinalController extends CreateBaseController {
  successHandler(req, res) {
    const { id } = req.sessionModel.get('move')

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${id}/confirmation`)
  }
}

module.exports = FinalController
