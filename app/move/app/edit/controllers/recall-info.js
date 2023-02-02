const CreateRecallInfoController = require('../../new/controllers/recall-info')

const UpdateBase = require('./base')

class UpdateRecallInfoController extends UpdateBase {
  constructor(options) {
    super(options)
    this.saveFields = ['recall_date']
  }

  saveValues(req, res, next) {
    this.saveMove(req, res, next)
  }
}

UpdateBase.mixin(UpdateRecallInfoController, CreateRecallInfoController)

module.exports = UpdateRecallInfoController
