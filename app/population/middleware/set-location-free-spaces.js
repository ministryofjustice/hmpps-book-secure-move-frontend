async function setLocationFreeSpaces(req, res, next) {
  try {
    const { dateRange, locations, location } = req

    const dailyFreeSpaceByCategory =
      await req.services.locationsFreeSpaces.getPrisonFreeSpaces({
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: location?.id || locations?.join(),
      })

    req.resultsAsPopulation = dailyFreeSpaceByCategory

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setLocationFreeSpaces
