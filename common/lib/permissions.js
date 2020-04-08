const policePermissions = [
  'moves:view:by_location',
  'moves:download:by_location',
  'move:view',
  'move:create',
  'move:cancel',
]
const supplierPermissions = [
  'moves:view:all',
  'moves:download:all',
  'moves:view:by_location',
  'moves:download:by_location',
  'move:view',
]
const prisonPermissions = [
  'moves:view:by_location',
  'moves:download:by_location',
  'move:view',
  'move:create',
  'move:cancel',
]
const ocaPermissions = [
  'moves:view:by_location',
  'moves:download:by_location',
  'moves:view:proposed',
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
