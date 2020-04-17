const policePermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:cancel',
]
const supplierPermissions = [
  'moves:view:all',
  'moves:view:outgoing',
  'moves:download',
  'move:view',
]
const prisonPermissions = [
  'moves:view:outgoing',
  'moves:download',
  'move:view',
  'move:create',
  'move:cancel',
]
const ocaPermissions = [
  'moves:view:dashboard',
  'moves:view:proposed',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:prison_to_prison',
]

const permissionsByRole = {
  ROLE_PECS_POLICE: policePermissions,
  ROLE_PECS_SCH: policePermissions,
  ROLE_PECS_STC: policePermissions,
  ROLE_PECS_PRISON: prisonPermissions,
  ROLE_PECS_HMYOI: prisonPermissions,
  ROLE_PECS_OCA: ocaPermissions,
  ROLE_PECS_SUPPLIER: supplierPermissions,
}

module.exports = {
  permissionsByRole,
}
