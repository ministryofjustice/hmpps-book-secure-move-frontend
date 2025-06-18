const UpdateBase = require('./base')

class DateChangeReasonController extends UpdateBase {
  constructor(options) {
    super(options)
    this.flashKey = 'date'
    this.saveFields = ['date', 'date_changed_reason']
  }

  saveValues(req, res, next) {
    req.form.values.date = req.sessionModel.get('proposedDate')
    this.saveMove(req, res, next)
  }
}

module.exports = DateChangeReasonController
