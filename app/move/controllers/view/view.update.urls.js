const getUpdateUrls = (updateSteps, move, req) => {
  const updateUrls = {}

  if (!req.checkPermissions(`move:update:${move.move_type}`)) {
    return updateUrls
  }

  updateSteps.forEach(updateJourney => {
    if (!req.checkPermissions(updateJourney.permission)) {
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
