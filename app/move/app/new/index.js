// NPM dependencies
const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('move:create'))

// Define routes
router.get('/', (req, res) => res.redirect(`${req.baseUrl}/${uuidv4()}`))
router.use(`/:id`, wizard(steps, fields, config, 'params.id'))

// Export
module.exports = {
  router,
  mountpath: '/new',
}
