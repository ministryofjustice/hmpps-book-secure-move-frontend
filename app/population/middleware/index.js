const redirectBaseUrl = require('./redirect-base-url')
const setBreadcrumb = require('./set-breadcrumb')
const setLocationFreeSpaces = require('./set-location-free-spaces')
const setPopulation = require('./set-population')
const setResultsAsFreeSpacesAndTransfersTables = require('./set-results.freespaces-and-transfers-tables')
const setResultsAsFreeSpacesTables = require('./set-results.freespaces-tables')

module.exports = {
  redirectBaseUrl,
  setBreadcrumb,
  setPopulation,
  setLocationFreeSpaces,
  setResultsAsFreeSpacesTables,
  setResultsAsFreeSpacesAndTransfersTables,
}
