const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { movesByRangeAndStatus = [] } = res.locals
  const template = 'moves/views/list-by-status'
  const locals = {
    pageTitle: 'moves::dashboard.single_moves',
    moves: movesByRangeAndStatus.map(
      presenters.moveToCardComponent({
        showMeta: false,
        showTags: false,
      })
    ),
  }

  res.render(template, locals)
}
