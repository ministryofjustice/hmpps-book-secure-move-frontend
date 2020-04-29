const { check } = require('../../../../common/middleware/permissions')

const getUpdateUrls = (updateSteps, moveId, userPermissions) => {
  const updateUrls = {}
  updateSteps.forEach(updateJourney => {
    if (!check(updateJourney.permission, userPermissions)) {
      return
    }
    const steps = updateJourney.steps
    const entryPointUrl = Object.keys(steps).filter(
      step => steps[step].entryPoint
    )[0]
    const key = updateJourney.key
    updateUrls[key] = `/move/${moveId}/edit${entryPointUrl}`
  })
  return updateUrls
}

module.exports = getUpdateUrls
