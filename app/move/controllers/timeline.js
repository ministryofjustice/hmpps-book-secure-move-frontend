const presenters = require('../../../common/presenters')

const getViewLocals = require('./view/view.locals')
const getTabsUrls = require('./view/view.tabs.urls')

module.exports = async function view(req, res) {
  const { move } = req

  const locals = {
    ...getViewLocals(req),
    timeline: presenters.eventsToTimelineComponent(move),
    urls: {
      tabs: getTabsUrls(move),
    },
  }

  res.render('move/views/timeline', locals)
}
