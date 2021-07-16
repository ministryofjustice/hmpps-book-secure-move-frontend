const editSteps = require('../../../app/move/app/edit/steps')

const getMoveUrl = require('./get-move-url')

function getUpdateUrls(move = {}, canAccess = () => false) {
  return Object.fromEntries(
    editSteps
      .filter(() => move._canEdit)
      .filter(step => canAccess(step.permission))
      .map(current => {
        const entryPointUrl = Object.keys(current.steps)[0]
        return [current.key, getMoveUrl(move.id, 'update', { entryPointUrl })]
      })
  )
}

module.exports = getUpdateUrls
