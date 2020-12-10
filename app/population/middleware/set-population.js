const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

async function setPopulation(req, res, next) {
  try {
    const { locationId, date } = req.params
    let transfersIn
    let transfersOut

    const dailyFreeSpace = await locationsFreeSpacesService.getPrisonFreeSpaces(
      {
        dateFrom: date,
        dateTo: date,
        locationIds: locationId,
      }
    )

    const freeSpacePopulation =
      dailyFreeSpace?.[0]?.meta?.populations?.[0] || {}
    const { id: populationId } = freeSpacePopulation

    if (populationId) {
      req.population = await req.services.population.getByIdWithMoves(
        populationId
      )

      transfersIn = req.population.moves_to.length
      transfersOut = req.population.moves_from.length
    } else {
      const options = { dateRange: [date, date], isAggregation: true }
      ;[transfersIn, transfersOut] = await Promise.all([
        req.services.move.getActive({
          ...options,
          toLocationId: locationId,
        }),
        req.services.move.getActive({
          ...options,
          fromLocationId: locationId,
        }),
      ])
    }

    req.transfers = {
      transfersIn,
      transfersOut,
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
