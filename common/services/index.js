const allocation = require('./allocation')
const courtHearing = require('./court-hearing')
const document = require('./document')
const { EventService: event } = require('./event')
const {
  ExtraditionFlightService: extraditionFlight,
} = require('./extradition-flight')
const frameworks = require('./frameworks')
const journey = require('./journey')
const locationsFreeSpaces = require('./locations-free-spaces')
const { LodgingService: lodging } = require('./lodging')
const move = require('./move')
const person = require('./person')
const personEscortRecord = require('./person-escort-record')
const population = require('./population')
const profile = require('./profile')
const referenceData = require('./reference-data')
const singleRequest = require('./single-request')
const youthRiskAssessment = require('./youth-risk-assessment')

module.exports = {
  allocation,
  courtHearing,
  document,
  frameworks,
  journey,
  locationsFreeSpaces,
  lodging,
  move,
  extraditionFlight,
  person,
  personEscortRecord,
  population,
  profile,
  referenceData,
  singleRequest,
  event,
  youthRiskAssessment,
}
