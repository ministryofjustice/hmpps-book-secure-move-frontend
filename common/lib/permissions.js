const policePermissions = [
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:prison_recall',
  'move:create:police_transfer',
  'move:create:video_remand',
  'move:cancel',
  'move:update',
]

const secureChildrensHomePermissions = [
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
  'move:update',
]
const secureTrainingCentrePermissions = [
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
  'move:update',
]

const supplierPermissions = [
  'locations:all',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
]
const prisonPermissions = [
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:cancel',
]
const ocaPermissions = [
  'dashboard:view',
  'allocations:view',
  'allocation:person:assign',
  'moves:view:proposed',
  'moves:download',
  'move:cancel:proposed',
  'move:view',
  'move:create',
  'move:create:prison_transfer',
]
const pmuPermissions = [
  'allocations:view',
  'allocation:create',
  'allocation:cancel',
  'dashboard:view',
  'locations:all',
  'moves:view:proposed',
  'move:review',
  'move:view',
]
const courtPermissions = [
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
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
  ROLE_PECS_COURT: courtPermissions,
}

module.exports = {
  permissionsByRole,
}
