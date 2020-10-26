const presenters = require('../../../common/presenters')
const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

async function setResultsPopulationTable(req, res, next) {
  try {
    const { dateRange, locations } = req

    const locationIds = locations.toString(',')

    const freeSpaces = await locationsFreeSpacesService.getLocationsFreeSpaces({
      dateFrom: dateRange[0],
      dateTo: dateRange[1],
      locationIds,
    })

    const query = req.query

    req.resultsAsPopulationTable = presenters.locationsToPopulationTableComponent(
      {
        query,
        startDate: dateRange[0],
        focusDate: new Date(),
      }
    )(freeSpaces)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTable
