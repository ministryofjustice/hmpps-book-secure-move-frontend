const CancelController = require('./cancel')
const AllocationCriteriaController = require('./create/allocation-criteria')
const AllocationDetailsController = require('./create/allocation-details')
const Save = require('./create/save')
const Unassign = require('./unassign')

const createControllers = {
  AllocationCriteriaController,
  AllocationDetailsController,
  Save,
}
const cancelControllers = {
  CancelController,
}
const unassignControllers = {
  Unassign,
}
module.exports = {
  cancelControllers,
  createControllers,
  unassignControllers,
}
