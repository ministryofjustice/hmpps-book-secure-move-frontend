const HospitalController = require('../create/hospital')

const UpdateBase = require('./base')

class UpdateHospitalController extends UpdateBase {
  getUpdateValues(req, res, values) {
    return req.initialStep ? req.getMove() : values
  }

  saveValues(req, res, next) {
    this.saveMove(req, res, next)
  }
}

UpdateBase.mixin(UpdateHospitalController, HospitalController)

module.exports = UpdateHospitalController
