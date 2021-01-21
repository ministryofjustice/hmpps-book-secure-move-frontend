const allocation = require('./allocation')
const allocationComplexCase = require('./allocation-complex-case')
const approve = require('./approve')
const assessmentQuestion = require('./assessment-question')
const cancel = require('./cancel')
const category = require('./category')
const courtCase = require('./court-case')
const courtHearing = require('./court-hearing')
const document = require('./document')
const ethnicity = require('./ethnicity')
const event = require('./event')
const filtered = require('./filtered')
const framework = require('./framework')
const frameworkFlag = require('./framework-flag')
const frameworkNomisMapping = require('./framework-nomis-mapping')
const frameworkQuestion = require('./framework-question')
const frameworkResponse = require('./framework-response')
const gender = require('./gender')
const image = require('./image')
const journey = require('./journey')
const location = require('./location')
const move = require('./move')
const person = require('./person')
const personEscortRecord = require('./person-escort-record')
const population = require('./population')
const prisonTransferReason = require('./prison-transfer-reason')
const profile = require('./profile')
const redirect = require('./redirect')
const region = require('./region')
const reject = require('./reject')
const supplier = require('./supplier')
const timetableEntry = require('./timetable-entry')
const youthRiskAssessment = require('./youth-risk-assessment')

module.exports = {
  allocation,
  allocation_complex_case: allocationComplexCase,
  approve,
  assessment_question: assessmentQuestion,
  cancel,
  category,
  court_case: courtCase,
  court_hearing: courtHearing,
  document,
  ethnicity,
  event,
  filtered,
  framework,
  framework_flag: frameworkFlag,
  framework_nomis_mapping: frameworkNomisMapping,
  framework_question: frameworkQuestion,
  framework_response: frameworkResponse,
  gender,
  image,
  journey,
  location,
  move,
  person,
  person_escort_record: personEscortRecord,
  population,
  prison_transfer_reason: prisonTransferReason,
  profile,
  redirect,
  region,
  reject,
  supplier,
  timetable_entry: timetableEntry,
  youth_risk_assessment: youthRiskAssessment,
}
