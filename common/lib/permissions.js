const { FEATURE_FLAGS } = require('../../config')

const policePermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:prison_recall',
  'move:cancel',
]

if (FEATURE_FLAGS.EDITABILITY) {
  policePermissions.push('move:update')
}

const secureChildrensHomePermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
]
const secureTrainingCentrePermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
]
if (FEATURE_FLAGS.EDITABILITY) {
  secureTrainingCentrePermissions.push('move:update')
}

const supplierPermissions = [
  'locations:all',
  'moves:view:outgoing',
  'moves:download',
  'move:view',
]
const prisonPermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
]
const ocaPermissions = [
  'dashboard:view',
  'moves:view:proposed',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:prison_transfer',
]
const pmuPermissions = [
  'allocations:view',
  'allocation:create',
  'dashboard:view',
  'locations:all',
  'moves:view:proposed',
  'move:review',
  'move:view',
]

const permissionsByRole = {
  ROLE_PECS_POLICE: policePermissions,
  ROLE_PECS_SCH: secureChildrensHomePermissions,
  ROLE_PECS_STC: secureTrainingCentrePermissions,
  ROLE_PECS_PRISON: prisonPermissions,
  ROLE_PECS_HMYOI: prisonPermissions,
  ROLE_PECS_OCA: ocaPermissions,
  ROLE_PECS_PMU: pmuPermissions,
  ROLE_PECS_SUPPLIER: supplierPermissions,
}

module.exports = {
  permissionsByRole,
}
