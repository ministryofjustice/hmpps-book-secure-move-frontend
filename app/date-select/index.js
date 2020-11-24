const router = require('express').Router()

const { applyDateSelect, renderDateSelectInputs } = require('./controllers')

router.post('/', applyDateSelect, renderDateSelectInputs)
router.get('/', renderDateSelectInputs)

module.exports = {
  router,
  mountpath: '/date-select',
}
