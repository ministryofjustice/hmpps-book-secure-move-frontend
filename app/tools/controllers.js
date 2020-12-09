const { uniq } = require('lodash')

const { permissionsByRole } = require('../../common/lib/permissions')

function renderPermissions(req, res) {
  res.render('_development-tools/views/permissions', {
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

module.exports = {
  renderPermissions,
  updatePermissions,
}
