const redirectBaseUrl = require('./redirect-base-url')
const setBodyFreeSpaces = require('./set-body.free-spaces')
const setBodyPopulationId = require('./set-body.population-id')
const setResultsAsDailySummary = require('./set-results.daily-summary')
const setResultsAsPopulationTable = require('./set-results.population-table')

module.exports = {
  setResultsAsPopulationTable,
  redirectBaseUrl,
  setResultsAsDailySummary,
  setBodyPopulationId,
  setBodyFreeSpaces,
}
