const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')
const moveService = require('../../../common/services/move')
const populationService = require('../../../common/services/population')

async function setPopulation(req, res, next) {
  try {
    const { locationId, date } = req.params
    let transfersIn = 0
    let transfersOut = 0

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
      req.population = await populationService.getById(populationId, {
        include: ['moves_from', 'moves_to', 'location'],
      })

      transfersIn = req.population.moves_to.length
      transfersOut = req.population.moves_from.length
    }

    if (!req.population) {
      ;[transfersIn, transfersOut] = await Promise.all([
        moveService.getActive({
          dateRange: [date, date],
          toLocationId: locationId,
          isAggregation: true,
        }),
        moveService.getActive({
          dateRange: [date, date],
          fromLocationId: locationId,
          isAggregation: true,
        }),
      ])
    }

    req.transfers = {
      transfersIn,
      transfersOut,
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setPopulation
