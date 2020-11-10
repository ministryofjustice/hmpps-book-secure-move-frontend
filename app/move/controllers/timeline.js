const populateResources = require('../../../common/lib/populate-resources')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

module.exports = async function view(req, res) {
  const { move } = req
  const { profile } = move

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
  }

  res.render('move/views/timeline', locals)
}
