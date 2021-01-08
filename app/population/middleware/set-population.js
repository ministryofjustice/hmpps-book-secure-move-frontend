async function setPopulation(req, res, next) {
  try {
    const { dateRange, resultsAsPopulation } = req
    const { locationId } = req.params

    const dailyFreeSpace =
      resultsAsPopulation?.[Object.keys(resultsAsPopulation)]

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
    req.date = dateRange[0]
    req.wizardKey = `${req.locationId}-${req.date}`

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setPopulation
