const redirectBaseUrl = require('./redirect-base-url')
const setBreadcrumb = require('./set-breadcrumb')
const setPopulation = require('./set-population')
const setResultsAsFreeSpacesAndTransfersTables = require('./set-results.freespaces-and-transfers-tables')
const setResultsAsFreeSpacesTables = require('./set-results.freespaces-tables')
const setResultsAsPopulation = require('./set-results.population')

module.exports = {
  redirectBaseUrl,
  setBreadcrumb,
  setPopulation,
  setResultsAsFreeSpacesTables,
  setResultsAsFreeSpacesAndTransfersTables,
  setResultsAsPopulation,
}
