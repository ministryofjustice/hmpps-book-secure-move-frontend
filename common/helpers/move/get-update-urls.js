const editSteps = require('../../../app/move/app/edit/steps')

const getMoveUrl = require('./get-move-url')

function getUpdateUrls(move = {}, canAccess = () => false) {
  return editSteps
    .filter(() => move._canEdit)
    .filter(step => canAccess(step.permission))
    .reduce((acc, current) => {
      const entryPointUrl = Object.keys(current.steps)[0]
      acc[current.key] = getMoveUrl(move.id, 'update', { entryPointUrl })
      return acc
    }, {})
}

module.exports = getUpdateUrls
