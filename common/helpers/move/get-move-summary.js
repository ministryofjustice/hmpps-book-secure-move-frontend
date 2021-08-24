const moveToMetaListComponent = require('../../presenters/move-to-meta-list-component')

function getMoveSummary(move) {
  if (!move) {
    return {}
  }

  const moveSummary = moveToMetaListComponent(move)

  const locals = {
    moveSummary,
  }

  return locals
}

module.exports = getMoveSummary
