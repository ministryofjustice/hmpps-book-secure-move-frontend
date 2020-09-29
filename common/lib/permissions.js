const policePermissions = [
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:hospital',
  'move:create:prison_recall',
  'move:create:police_transfer',
  'move:create:video_remand',
  'move:cancel',
  'move:update',
  'move:update:court_appearance',
  'move:update:hospital',
  'move:update:prison_transfer',
  'move:update:secure_childrens_home',
  'move:update:secure_training_centre',
  'move:update:prison_recall',
  'move:update:police_transfer',
  'move:update:video_remand',
]

const secureChildrensHomePermissions = [
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:view:proposed',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:hospital',
  'move:create:prison_transfer',
  'move:create:secure_childrens_home',
  'move:create:secure_training_centre',
  'move:update',
  'move:update:court_appearance',
  'move:update:hospital',
  'move:cancel',
  'move:cancel:proposed',
]
const secureTrainingCentrePermissions = [
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:view:proposed',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:hospital',
  'move:create:prison_transfer',
  'move:create:secure_childrens_home',
  'move:create:secure_training_centre',
  'move:update',
  'move:update:court_appearance',
  'move:update:hospital',
  'move:cancel',
  'move:cancel:proposed',
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
  'move:create:hospital',
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
const personEscortRecordAuthorPermissions = [
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'dashboard:view',
  'moves:view:outgoing',
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
  ROLE_PECS_PER_AUTHOR: personEscortRecordAuthorPermissions,
}

module.exports = {
  permissionsByRole,
}
