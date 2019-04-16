// Local dependencies
const index = require('./index')

// Export
module.exports.bind = app => {
  app.use(index.router)
}
