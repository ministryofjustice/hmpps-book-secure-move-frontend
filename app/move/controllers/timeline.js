const moveHelpers = require('../../../common/helpers/move')
const presenters = require('../../../common/presenters')

module.exports = async function view(req, res) {
  const { move } = req

  const timeline = presenters.moveToTimelineComponent(move)

  const locals = {
    ...moveHelpers.getLocals(req),
    timeline,
    urls: {
      tabs: moveHelpers.getTabsUrls(move),
    },
  }

  res.render('move/views/timeline', locals)
}
