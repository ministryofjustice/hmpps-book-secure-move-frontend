const { formatDate } = require('../../../../../config/nunjucks/filters')
const CreateMoveDateController = require('../../new/controllers/move-date')

const UpdateBase = require('./base')

class UpdateMoveDateController extends UpdateBase {
  constructor(options) {
    super(options)
    this.saveFields = ['date']
  }

  setNextStep(req, res, next) {
    if (this.isPrisonTransfer(req)) {
      next()
    } else {
      super.setNextStep(req, res, next)
    }
  }

  setButtonText(req, res, next) {
    req.form.options.buttonText = this.isPrisonTransfer(req)
      ? 'actions::continue'
      : 'actions::save_and_continue'
    next()
  }

  getUpdateValues(req, res) {
    const move = req.getMove()

    if (!move) {
      return {}
    }

    const values = {}
    values.date_type = 'custom'
    const dateFormat = 'yyyy-MM-dd'
    const dates = {
      [formatDate(res.locals.TODAY, dateFormat)]: 'today',
      [formatDate(res.locals.TOMORROW, dateFormat)]: 'tomorrow',
    }

    if (dates[move.date]) {
      values.date_type = dates[move.date]
    }

    if (values.date_type === 'custom') {
      values.date_custom = formatDate(move.date)
    }

    return values
  }

  saveValues(req, res, next) {
    if (this.isPrisonTransfer(req)) {
      req.sessionModel.set('proposedDate', req.form.values.date)
      next()
    } else {
      this.saveMove(req, res, next)
    }
  }

  isPrisonTransfer(req) {
    return req.getMove().move_type === 'prison_transfer'
  }
}

UpdateBase.mixin(UpdateMoveDateController, CreateMoveDateController)

module.exports = UpdateMoveDateController
