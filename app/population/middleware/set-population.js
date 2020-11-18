const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')
const populationService = require('../../../common/services/population')

async function setPopulation(req, res, next) {
  try {
    const { locationId, date } = req.params

    const dailyFreeSpace = await locationsFreeSpacesService.getPrisonFreeSpaces(
      {
        dateFrom: date,
        dateTo: date,
        locationIds: locationId,
      }
    )

    const population = dailyFreeSpace?.[0]?.meta?.populations?.[0] || {}
    const { id: populationId } = population

    if (populationId) {
      req.population = await populationService.getById(populationId)
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setPopulation
