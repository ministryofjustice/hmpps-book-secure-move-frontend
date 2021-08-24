const moveToMetaListComponent = require('../../presenters/move-to-meta-list-component')

function getMoveSummary(move, opts) {
  if (!move) {
    return {}
  }

  const moveSummary = moveToMetaListComponent(move, opts)

  const locals = {
    moveSummary,
  }

  return locals
}

module.exports = getMoveSummary
