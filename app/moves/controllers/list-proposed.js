const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  // todo: this will become proposed moves instead of active
  const { activeMovesByDate = [] } = res.locals
  const template = 'moves/views/list-proposed'
  const locals = {
    pageTitle: 'moves::dashboard.single_moves',
    moves: activeMovesByDate.map(
      presenters.moveToCardComponent({
        showMeta: false,
        showTags: false,
      })
    ),
  }

  res.render(template, locals)
}
