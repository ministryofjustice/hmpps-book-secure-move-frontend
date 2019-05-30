// Local dependencies
const dashboard = require('./dashboard')
const moves = require('./moves')
const auth = require('./auth')

// Export
module.exports.bind = app => {
  app.use(dashboard.router)
  app.use(moves.router)
  app.use(auth.router)
}
