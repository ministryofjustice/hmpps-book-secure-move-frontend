const PersonAssignBase = require('./base')

class AgreementStatusController extends PersonAssignBase {
  saveValues(req, res, next) {
    req.sessionModel.set('move', {
      ...req.sessionModel.get('move'),
      ...req.form.values,
    })
    super.saveValues(req, res, next)
  }
}

module.exports = AgreementStatusController
