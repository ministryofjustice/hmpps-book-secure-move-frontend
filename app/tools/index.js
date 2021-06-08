// NPM dependencies
const router = require('express').Router()

const { ENABLE_DEVELOPMENT_TOOLS } = require('../../config')

const routes = {
  permissions: '/permissions',
  moveChangeStatus: '/progress-move',
  completeAssessment: '/complete',
}

// Local dependencies
const {
  updatePermissions,
  renderPermissions,
  updateMoveStatus,
  completeAssessment,
} = require('./controllers')

// Define routes
router.route(routes.permissions).get(renderPermissions).post(updatePermissions)
router
  .route(`${routes.moveChangeStatus}/:moveId/:currentStatus`)
  .all(updateMoveStatus)
router.route('/complete/:type/:assessmentId').get(completeAssessment)

// Export
module.exports = {
  router,
  routes,
  mountpath: '/tools',
  // Only load app when enabled
  skip: !ENABLE_DEVELOPMENT_TOOLS,
}
