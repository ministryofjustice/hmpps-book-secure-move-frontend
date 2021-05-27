const faker = require('faker')
const { uniq } = require('lodash')

const { permissionsByRole } = require('../../common/lib/permissions')

const permittedActions = {
  requested: {
    method: 'accept',
    data: null,
  },
  booked: {
    method: 'start',
    data: null,
  },
  in_transit: {
    method: 'complete',
    data: {
      notes: faker.lorem.sentence(),
    },
  },
}

function renderPermissions(req, res) {
  res.render('tools/views/permissions', {
    activeRoles: req.session.activeRoles || [],
    roles: permissionsByRole,
  })
}

function updatePermissions(req, res) {
  const roles = req.body.roles || []
  const permissions = uniq(roles.map(role => permissionsByRole[role]).flat())

  req.session.activeRoles = roles

  req.session.user = req.session.user || {}
  req.session.user.permissions = permissions

  res.redirect('/')
}

async function updateMoveStatus(req, res, next) {
  try {
    const moveId = req.params.moveId
    const currentStatus = req.params.currentStatus
    const action = permittedActions[currentStatus]

    if (action) {
      await req.services.move[action.method](moveId, action.data)
    }

    res.redirect(`/move/${moveId}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPermissions,
  updatePermissions,
  updateMoveStatus,
}
