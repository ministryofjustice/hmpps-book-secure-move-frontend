async function setResultsAsPopulation(req, res, next) {
  try {
    const { dateRange, locations, locationId } = req

    const freeSpaces = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: locationId || locations?.join(),
      }
    )

    req.resultsAsPopulation = freeSpaces

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAsPopulation
