async function setLocationFreeSpaces(req, res, next) {
  try {
    const { dateRange } = req
    const { locationId, locations } = req.params

    const dailyFreeSpaceByCategory = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: locationId || locations?.join(),
      }
    )

    req.resultsAsPopulation = dailyFreeSpaceByCategory

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setLocationFreeSpaces
