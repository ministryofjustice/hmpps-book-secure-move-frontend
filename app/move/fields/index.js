const { cloneDeep } = require('lodash')

const additionalInformation = require('./additional-information')
const cancellationReason = require('./cancellation-reason')
const cancellationReasonComment = require('./cancellation-reason-comment')
const assessmentAnswer = require('./common.assessment-answer')
const courtHearingComments = require('./court-hearing-comments')
const courtHearingCourtCase = require('./court-hearing-court-case')
const courtHearingStartTime = require('./court-hearing-start-time')
const date = require('./date')
const dateCustom = require('./date-custom')
const dateFrom = require('./date-from')
const dateOfBirth = require('./date-of-birth')
const dateTo = require('./date-to')
const dateType = require('./date-type')
const documents = require('./documents')
const ethnicity = require('./ethnicity')
const filterPoliceNationalComputer = require('./filter.police-national-computer')
const filterPrisonNumber = require('./filter.prison-number')
const firstNames = require('./first-names')
const gender = require('./gender')
const genderAdditionalInformation = require('./gender-additional-information')
const hasCourtCase = require('./has-court-case')
const hasDateTo = require('./has-date-to')
const lastName = require('./last-name')
const moveAgreed = require('./move-agreed')
const moveAgreedAssign = require('./move-agreed-assign')
const moveAgreedBy = require('./move-agreed-by')
const moveNotAgreedInstruction = require('./move-not-agreed-instruction')
const moveType = require('./move-type')
const people = require('./people')
const policeNationalComputer = require('./police-national-computer')
const policeNationalComputerUpdate = require('./police-national-computer.update')
const prisonTransferType = require('./prison-transfer-type')
const reviewFields = require('./review')
const shouldSaveCourtHearings = require('./should-save-court-hearings')
const specialVehicleCheck = require('./special-vehicle-check')
const toLocation = require('./to-location')
const toLocationCourtAppearance = require('./to-location-court-appearance')
const toLocationPoliceTransfer = require('./to-location-police-transfer')
const toLocationPrisonTransfer = require('./to-location-prison-transfer')

const cancelFields = {
  cancellation_reason: cancellationReason,
  cancellation_reason_comment: cancellationReasonComment,
}

const createFields = {
  concealed_items: assessmentAnswer(),
  court_hearing__comments: courtHearingComments,
  court_hearing__court_case: courtHearingCourtCase,
  court_hearing__start_time: courtHearingStartTime,
  date,
  date_custom: dateCustom,
  date_from: dateFrom,
  date_of_birth: dateOfBirth,
  date_to: dateTo,
  date_type: dateType,
  documents,
  escape: assessmentAnswer(),
  ethnicity,
  'filter.police_national_computer': filterPoliceNationalComputer,
  'filter.prison_number': filterPrisonNumber,
  first_names: firstNames,
  gender,
  gender_additional_information: genderAdditionalInformation,
  has_court_case: hasCourtCase,
  has_date_to: hasDateTo,
  health_issue: assessmentAnswer(),
  hold_separately: assessmentAnswer(),
  interpreter: assessmentAnswer(),
  last_name: lastName,
  medication: assessmentAnswer(),
  move_agreed: moveAgreed,
  move_agreed_by: moveAgreedBy,
  move_type: moveType,
  not_to_be_released: assessmentAnswer({
    isRequired: true,
    isExplicit: true,
  }),
  other_court: assessmentAnswer({ isRequired: true }),
  other_health: assessmentAnswer({ isRequired: true }),
  other_risks: assessmentAnswer({ isRequired: true }),
  people,
  police_national_computer: policeNationalComputer,
  pregnant: assessmentAnswer(),
  prison_recall_comments: {
    ...cloneDeep(additionalInformation),
    skip: true,
  },
  prison_transfer_type: prisonTransferType,
  prison_transfer_comments: {
    ...cloneDeep(additionalInformation),
    name: 'prison_transfer_comments',
    id: 'prison_transfer_comments',
  },
  self_harm: assessmentAnswer(),
  solicitor: assessmentAnswer(),
  special_diet_or_allergy: assessmentAnswer(),
  special_vehicle: assessmentAnswer({
    isRequired: true,
    isExplicit: true,
  }),
  should_save_court_hearings: shouldSaveCourtHearings,
  to_location: toLocation,
  to_location_court_appearance: toLocationCourtAppearance,
  to_location_police_transfer: toLocationPoliceTransfer,
  to_location_prison_transfer: toLocationPrisonTransfer,
  wheelchair: assessmentAnswer(),
  video_remand_comments: {
    ...cloneDeep(additionalInformation),
    skip: true,
  },
  violent: assessmentAnswer(),
}

const updateFields = {
  ...cloneDeep(createFields),
  police_national_computer: policeNationalComputerUpdate,
}

const assignFields = {
  ...cloneDeep(createFields),
  move_agreed: moveAgreedAssign,
  move_not_agreed_instruction: moveNotAgreedInstruction,
  special_vehicle_check: specialVehicleCheck,
}

module.exports = {
  assignFields,
  cancelFields,
  createFields,
  reviewFields,
  updateFields,
}
