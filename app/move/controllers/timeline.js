const presenters = require('../../../common/presenters')

const getViewLocals = require('./view/view.locals')
const getTabsUrls = require('./view/view.tabs.urls')

module.exports = async function view(req, res) {
  const { move } = req

  const timeline = presenters.moveToTimelineComponent(move)

  const locals = {
    ...getViewLocals(req),
    timeline,
    urls: {
      tabs: getTabsUrls(move),
    },
  }

  res.render('move/views/timeline', locals)
}
