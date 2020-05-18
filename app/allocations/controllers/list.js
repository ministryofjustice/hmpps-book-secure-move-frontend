const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { pagination } = req
  const { allocations = [] } = res.locals
  const template = 'allocations/views/list'
  const locals = {
    pagination,
    pageTitle: req.t('allocations::dashboard.heading'),
    ...presenters.allocationsToTable(allocations),
  }

  res.render(template, locals)
}
