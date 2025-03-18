const additionalInformation = require('./additional-information')
const assessmentAnswer = require('./common.assessment-answer')
const courtHearingComments = require('./court-hearing-comments')
const courtHearingCourtCase = require('./court-hearing-court-case')
const courtHearingStartTime = require('./court-hearing-start-time')
const date = require('./date')
const dateCustom = require('./date-custom')
const dateFrom = require('./date-from')
const dateOfBirth = require('./date-of-birth')
const datePicker = require('./date-picker')
const dateTo = require('./date-to')
const dateType = require('./date-type')
const documents = require('./documents')
const ethnicity = require('./ethnicity')
const extraditionFlightDate = require('./extradition-flight-date')
const extraditionFlightNumber = require('./extradition-flight-number')
const extraditionFlightTime = require('./extradition-flight-time')
const filterPoliceNationalComputer = require('./filter.police-national-computer')
const filterPrisonNumber = require('./filter.prison-number')
const firstNames = require('./first-names')
const gender = require('./gender')
const genderAdditionalInformation = require('./gender-additional-information')
const hasCourtCase = require('./has-court-case')
const hasDateTo = require('./has-date-to')
const lastName = require('./last-name')
const moveAgreed = require('./move-agreed')
const moveAgreedBy = require('./move-agreed-by')
const moveType = require('./move-type')
const people = require('./people')
const policeNationalComputer = require('./police-national-computer')
const prisonRecallComments = require('./prison-recall-comments')
const prisonTransferComments = require('./prison-transfer-comments')
const prisonTransferType = require('./prison-transfer-type')
const recallDate = require('./recall-date')
const servingYouthSentence = require('./serving-youth-sentence')
const shouldSaveCourtHearings = require('./should-save-court-hearings')
const timeDue = require('./time-due')
const toLocation = require('./to-location')
const toLocationApprovedPremises = require('./to-location-approved-premises')
const toLocationCourtAppearance = require('./to-location-court-appearance')
const toLocationExtradition = require('./to-location-extradition')
const toLocationHospital = require('./to-location-hospital')
const toLocationPoliceTransfer = require('./to-location-police-transfer')
const toLocationPrisonTransfer = require('./to-location-prison-transfer')
const toLocationSecureChildrensHomeTransfer = require('./to-location-secure-childrens-home')
const toLocationSecureTrainingCentreTransfer = require('./to-location-secure-training-centre')
const videoRemandComments = require('./video-remand-comments')

const fields = {
  additional_information: additionalInformation,
  concealed_items: assessmentAnswer(),
  court_hearing__comments: courtHearingComments,
  court_hearing__court_case: courtHearingCourtCase,
  court_hearing__start_time: courtHearingStartTime,
  date,
  date_picker: datePicker,
  date_custom: dateCustom,
  date_from: dateFrom,
  date_of_birth: dateOfBirth,
  date_to: dateTo,
  date_type: dateType,
  documents,
  escape: assessmentAnswer(),
  ethnicity,
  extradition_flight_date: extraditionFlightDate,
  extradition_flight_number: extraditionFlightNumber,
  extradition_flight_time: extraditionFlightTime,
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
  prison_recall_comments: prisonRecallComments,
  prison_transfer_type: prisonTransferType,
  prison_transfer_comments: prisonTransferComments,
  recall_date: recallDate,
  self_harm: assessmentAnswer(),
  solicitor: assessmentAnswer(),
  special_diet_or_allergy: assessmentAnswer(),
  special_vehicle: assessmentAnswer({
    isRequired: true,
    isExplicit: true,
  }),
  serving_youth_sentence: servingYouthSentence,
  should_save_court_hearings: shouldSaveCourtHearings,
  time_due: timeDue,
  to_location: toLocation,
  to_location_approved_premises: toLocationApprovedPremises,
  to_location_court_appearance: toLocationCourtAppearance,
  to_location_extradition: toLocationExtradition,
  to_location_hospital: toLocationHospital,
  to_location_police_transfer: toLocationPoliceTransfer,
  to_location_prison_transfer: toLocationPrisonTransfer,
  to_location_secure_childrens_home: toLocationSecureChildrensHomeTransfer,
  to_location_secure_training_centre: toLocationSecureTrainingCentreTransfer,
  wheelchair: assessmentAnswer(),
  video_remand_comments: videoRemandComments,
  violent: assessmentAnswer(),
}

module.exports = fields
