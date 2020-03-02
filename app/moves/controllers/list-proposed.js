const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { proposedMovesByWeek = [] } = res.locals
  const template = 'moves/views/list-proposed'
  const locals = {
    pageTitle: 'moves::dashboard.single_moves',
    moves: proposedMovesByWeek.map(
      presenters.moveToCardComponent({
        showMeta: false,
        showTags: false,
      })
    ),
  }

  res.render(template, locals)
}
