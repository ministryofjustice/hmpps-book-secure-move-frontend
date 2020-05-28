const CancelController = require('./cancel')
const AllocationCriteriaController = require('./create/allocation-criteria')
const AllocationDetailsController = require('./create/allocation-details')
const Save = require('./create/save')

const createControllers = {
  AllocationCriteriaController,
  AllocationDetailsController,
  Save,
}
const cancelControllers = {
  CancelController,
}

module.exports = {
  cancelControllers,
  createControllers,
}
