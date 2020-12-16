const moveToMetaListComponent = require('../../presenters/move-to-meta-list-component')

function getMoveWithSummary(move) {
  const moveSummary = moveToMetaListComponent(move)

  const locals = {
    move,
    moveSummary,
  }

  return locals
}

module.exports = getMoveWithSummary
