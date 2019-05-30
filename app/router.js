// Local dependencies
const dashboard = require('./dashboard')
const auth = require('./auth')

// Export
module.exports.bind = app => {
  app.use(dashboard.router)
  app.use(auth.router)
}
