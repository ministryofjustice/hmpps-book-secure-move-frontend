const populateResources = require('../../../common/lib/populate-resources')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const getTabsUrls = require('./view/view.tabs.urls')

module.exports = async function view(req, res) {
  const move = await moveService.getById(req.params.id, {
    include: [
      'profile',
      'profile.person',
      'from_location',
      'to_location',
      'timeline_events',
      'timeline_events.eventable',
    ],
    populateResources: true,
  })

  const { profile, timeline_events: moveEvents } = move

  const urls = {
    tabs: getTabsUrls(move),
  }

  const { assessment_answers: assessmentAnswers = [] } = profile || {}

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
