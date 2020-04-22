const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { allocations = [] } = res.locals
  const template = 'allocations/views/list'
  const locals = {
    pageTitle: req.t('allocations::dashboard.heading'),
    ...presenters.allocationsToTable(allocations),
  }

  res.render(template, locals)
}
