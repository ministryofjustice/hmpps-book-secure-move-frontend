const PersonalDetails = require('../create/personal-details')
const UpdateBase = require('./base')

class UpdatePersonalDetailsController extends UpdateBase {}

UpdateBase.mixin(UpdatePersonalDetailsController, PersonalDetails)

module.exports = UpdatePersonalDetailsController
