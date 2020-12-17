async function setPopulation(req, res, next) {
  try {
    const { locationId, date } = req.params

    const dailyFreeSpaceByCategory = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: date,
        dateTo: date,
        locationIds: locationId,
      }
    )

    const dailyFreeSpace =
      dailyFreeSpaceByCategory?.[Object.keys(dailyFreeSpaceByCategory)]

    req.locationName = dailyFreeSpace?.[0]?.title

    const freeSpacePopulation =
      dailyFreeSpace?.[0]?.meta?.populations?.[0] || {}
    const {
      id: populationId,
      transfers_in: transfersIn,
      transfers_out: transfersOut,
    } = freeSpacePopulation

    req.transfers = {
      transfersIn,
      transfersOut,
    }

    if (populationId) {
      req.population = await req.services.population.getByIdWithMoves(
        populationId
      )
    }

    req.locationId = locationId
    req.date = date
    req.wizardKey = `${req.locationId}-${req.date}`

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setPopulation
