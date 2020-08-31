const { check } = require('../../../../common/middleware/permissions')

const getUpdateUrls = (updateSteps, move, userPermissions) => {
  const updateUrls = {}

  if (!check(`move:update:${move.move_type}`, userPermissions)) {
    return updateUrls
  }

  updateSteps.forEach(updateJourney => {
    if (!check(updateJourney.permission, userPermissions)) {
      return
    }

    const steps = updateJourney.steps
    const entryPointUrl = Object.keys(steps).filter(
      step => steps[step].entryPoint
    )[0]
    const key = updateJourney.key
    updateUrls[key] = `/move/${move.id}/edit${entryPointUrl}`
  })
  return updateUrls
}

module.exports = getUpdateUrls
