const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

async function setResultsPopulationTable(req, res, next) {
  try {
    const { locationId, date } = req.params

    const freeSpaces = await locationsFreeSpacesService.getPrisonFreeSpaces({
      dateFrom: date,
      dateTo: date,
      locationIds: locationId,
    })

    const population = freeSpaces?.[0]?.meta?.populations?.[0] || {}
    const { id: populationId } = population

    req.populationId = populationId

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTable
