// NPM dependencies
const router = require('express').Router()
const { get } = require('lodash')

const permissions = require('../../common/middleware/permissions')

// Local dependencies
const { mountpath: movesUrl } = require('../moves')
const { mountpath: allocationsUrl } = require('../allocations')

// Define routes
router.get('/', (req, res) => {
  const userPermissions = get(req.session, 'user.permissions')
  const canViewAllocations = permissions.check(
    'allocations:view',
    userPermissions
  )
  res.redirect(canViewAllocations ? allocationsUrl : movesUrl)
})

// Export
module.exports = {
  router,
  mountpath: '/',
}
