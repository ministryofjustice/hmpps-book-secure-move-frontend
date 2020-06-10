const CancelController = require('./cancel')
const AllocationCriteriaController = require('./create/allocation-criteria')
const AllocationDetailsController = require('./create/allocation-details')
const Save = require('./create/save')
const RemoveMoveController = require('./remove-move')

const createControllers = {
  AllocationCriteriaController,
  AllocationDetailsController,
  Save,
}
const cancelControllers = {
  CancelController,
}

const removeMoveControllers = {
  RemoveMoveController,
}

module.exports = {
  cancelControllers,
  removeMoveControllers,
  createControllers,
}
