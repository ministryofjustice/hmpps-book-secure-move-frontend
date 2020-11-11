const populateResources = require('../../../common/lib/populate-resources')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const getTabsUrls = require('./view/view.tabs.urls')

module.exports = async function view(req, res) {
  const { move } = req
  const { profile } = move

  const urls = {
    tabs: getTabsUrls(move),
  }

  const { assessment_answers: assessmentAnswers = [] } = profile || {}

  const { timeline_events: moveEvents } = await moveService.getById(move.id, {
    include: 'timeline_events',
    populateResources: true,
  })

  await populateResources(moveEvents)

  const locals = {
    move,
    moveSummary: presenters.moveToMetaListComponent(move),
    tagList: presenters.assessmentToTagList(assessmentAnswers),
    timeline: presenters.eventsToTimelineComponent(moveEvents, move),
    urls,
  }

  res.render('move/views/timeline', locals)
}
