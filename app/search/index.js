// NPM dependencies
const router = require('express').Router()

// const setRequestFilters = require('../../common/middleware/set-request-filters')

// Local dependencies
const { renderSearchForm, renderSearchResults } = require('./controllers')
const fields = require('./fields')
const { processSearchTerm, processSearchResults } = require('./middleware')

// Define routes
router.get('/', renderSearchForm(fields))
router.get(
  '/results',
  processSearchTerm,
  processSearchResults,
  // setRequestFilters(fields, '/search'),
  renderSearchResults
)

// Export
module.exports = {
  router,
  mountpath: '/search',
}
