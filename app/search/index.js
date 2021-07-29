// NPM dependencies
const router = require('express').Router()

const setRequestFilters = require('../../common/middleware/set-request-filters')

// Local dependencies
const { renderSearchForm, renderSearchResults } = require('./controllers')
const fields = require('./fields')

// Define routes
router.get('/', renderSearchForm(fields))
router.get(
  '/results',
  setRequestFilters(fields, '/search'),
  renderSearchResults
)

// Export
module.exports = {
  router,
  mountpath: '/search',
}
