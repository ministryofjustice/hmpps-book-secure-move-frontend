const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getTagLists(req) {
  const { move } = req
  const { profile } = move
  const { assessment_answers: assessmentAnswers = [] } = profile || {}

  const moveUrl = getMoveUrl(move.id)

  const tagLists = {
    tagList: presenters.assessmentToTagList(assessmentAnswers, moveUrl),
    importantEventsTagList: presenters.moveToImportantEventsTagListComponent(
      move
    ),
  }

  return tagLists
}

module.exports = getTagLists
