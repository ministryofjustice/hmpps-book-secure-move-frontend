const router = require('express').Router()

const {
  applyFilters,
  setFiltersInputs,
  renderFiltersInputs,
} = require('./controllers')
const fields = require('./fields')

router.post('/', applyFilters(fields))
router.get('/', setFiltersInputs(fields), renderFiltersInputs)

module.exports = {
  router,
  mountpath: '/filters',
}
