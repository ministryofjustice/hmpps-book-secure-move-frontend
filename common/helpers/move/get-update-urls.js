const getMoveUrl = require('./get-move-url')

const getUpdateUrls = (updateSteps, req) => {
  const { move } = req
  const updateUrls = {}

  if (!req.canAccess(`move:update:${move.move_type}`)) {
    return updateUrls
  }

  updateSteps.forEach(updateJourney => {
    if (!req.canAccess(updateJourney.permission)) {
      return
    }

    const steps = updateJourney.steps
    const entryPointUrl = Object.keys(steps).filter(
      step => steps[step].entryPoint
    )[0]
    const key = updateJourney.key
    updateUrls[key] = getMoveUrl(move.id, 'update', { entryPointUrl })
  })
  return updateUrls
}

module.exports = getUpdateUrls
