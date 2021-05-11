const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getTagLists(move) {
  const { profile } = move
  const { assessment_answers: assessmentAnswers = [] } = profile || {}

  const moveUrl = getMoveUrl(move.id)

  const tagLists = {
    importantEventsTagList:
      presenters.moveToImportantEventsTagListComponent(move),
    tagList: presenters.assessmentToTagList(assessmentAnswers, moveUrl),
  }

  return tagLists
}

module.exports = getTagLists
