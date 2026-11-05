const MoveCreatePrisonTransferReasonController = require('../../new/controllers/prison-transfer-reason')

const PersonAssignBase = require('./base')

class PrisonTransferReasonController extends PersonAssignBase {}

PersonAssignBase.mixin(
  PrisonTransferReasonController,
  MoveCreatePrisonTransferReasonController
)

module.exports = PrisonTransferReasonController
