// Local dependencies
const dashboard = require('./dashboard')

// Export
module.exports.bind = app => {
  app.use(dashboard.router)
}
