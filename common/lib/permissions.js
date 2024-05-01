const { uniq } = require('lodash')

const policePermissions = [
  'dashboard:view',
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
  'move:lodging:add_events',
  'move:lodging:handover',
  'move:lockout:add_events',
  'move:lockout:handover',
  'move:update',
  'move:update:court_appearance',
  'move:update:hospital',
  'move:update:prison_transfer',
  'move:update:secure_childrens_home',
  'move:update:secure_training_centre',
  'move:update:prison_recall',
  'move:update:police_transfer',
  'move:update:video_remand',
  'move:add:date_of_arrest',
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
]

const contractDeliveryManagerPermissions = [
  'dashboard:view',
  'allocations:view',
  'locations:contract_delivery_manager',
  'locations:all',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:view:proposed',
  'move:view',
  'move:view:journeys',
  'moves:download',
  'person_escort_record:view',
  'person_escort_record:print',
  'youth_risk_assessment:view',
]

const readOnlyPermissions = [
  'dashboard:view',
  'allocations:view',
  'locations:contract_delivery_manager',
  'locations:all',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:view:proposed',
  'move:view',
  'person_escort_record:view',
  'person_escort_record:print',
  'youth_risk_assessment:view',
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
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
  'youth_risk_assessment:view',
  'youth_risk_assessment:create',
  'youth_risk_assessment:update',
  'youth_risk_assessment:confirm',
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
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
  'youth_risk_assessment:view',
  'youth_risk_assessment:create',
  'youth_risk_assessment:update',
  'youth_risk_assessment:confirm',
]

const supplierPermissions = [
  'locations:all',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'person_escort_record:view',
  'person_escort_record:print',
  'youth_risk_assessment:view',
]
const prisonPermissions = [
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'move:create',
  'move:create:court_appearance',
  'move:create:hospital',
  'move:create:approved_premises',
  'move:create:extradition',
  'move:cancel',
  'move:update',
  'move:update:approved_premises',
  'move:update:court_appearance',
  'move:update:hospital',
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
  'youth_risk_assessment:view',
  'youth_risk_assessment:create',
  'youth_risk_assessment:update',
  'youth_risk_assessment:confirm',
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
  'move:create:secure_childrens_home',
  'move:create:secure_training_centre',
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
]
const pmuPermissions = [
  'allocations:view',
  'allocation:create',
  'allocation:cancel',
  'allocation:update',
  'dashboard:view',
  'dashboard:view:population',
  'locations:all',
  'moves:view:proposed',
  'move:review',
  'move:view',
  'move:update',
  'move:update:prison_transfer',
  'move:lodging:cancel',
  'move:lodging:create',
  'move:lodging:update',
  'person_escort_record:view',
  'person_escort_record:print',
  'youth_risk_assessment:view',
]
const courtPermissions = [
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
  'moves:download',
  'move:view',
  'person_escort_record:view',
  'youth_risk_assessment:view',
]
const personEscortRecordAuthorPermissions = [
  'person_escort_record:view',
  'person_escort_record:create',
  'person_escort_record:update',
  'person_escort_record:confirm',
  'person_escort_record:print',
  'dashboard:view',
  'moves:view:outgoing',
  'moves:view:incoming',
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
  ROLE_PECS_CDM: contractDeliveryManagerPermissions,
  ROLE_PECS_READ_ONLY: readOnlyPermissions,
}

const rolesToPermissions = (roles, mapping = permissionsByRole) =>
  uniq(roles.map(role => mapping[role] || []).flat())

module.exports = {
  permissionsByRole,
  rolesToPermissions,
}
