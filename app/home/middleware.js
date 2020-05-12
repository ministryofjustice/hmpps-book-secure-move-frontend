const { get } = require('lodash')

const permissions = require('../../common/middleware/permissions')
const { mountpath: allocationsUrl } = require('../allocations')
const { mountpath: movesUrl } = require('../moves')

function determineEntryPoint(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions')
  const canViewAllocations = permissions.check(
    'allocations:view',
    userPermissions
  )
  res.locals.entryPoint = canViewAllocations ? allocationsUrl : movesUrl
  next()
}

module.exports = {
  determineEntryPoint,
}
