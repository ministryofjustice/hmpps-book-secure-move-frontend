const personIdentifier = require('./person-identifier')
const policeNationalComputer = require('./police-national-computer')
const prisonNumber = require('./prison-number')
const reference = require('./reference')
const searchType = require('./search-type')

module.exports = {
  person_identifier: personIdentifier,
  police_national_computer: policeNationalComputer,
  prison_number: prisonNumber,
  reference,
  search_type: searchType,
}
