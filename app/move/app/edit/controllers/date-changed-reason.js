const UpdateBase = require('./base')

class DateChangedReasonController extends UpdateBase {
  constructor(options) {
    super(options)
    this.flashKey = 'date'
    this.saveFields = ['date', 'date_changed_reason']
  }

  process(req, res, next) {
    req.form.values.date = req.sessionModel.get('proposedDate')
    return super.process(req, res, next)
  }

  saveValues(req, res, next) {
    this.saveMove(req, res, next)
  }
}

module.exports = DateChangedReasonController
