const presenters = require('../../../common/presenters')
const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

async function setResultsPopulationTable(req, res, next) {
  try {
    const { dateRange, locations, query } = req

    const freeSpaces = await locationsFreeSpacesService.getPrisonFreeSpaces({
      dateFrom: dateRange[0],
      dateTo: dateRange[1],
      locationIds: locations?.join(),
    })

    req.resultsAsPopulationTable = presenters.locationsToPopulationTableComponent(
      {
        query,
        startDate: dateRange[0],
        focusDate: new Date(), // FIXME - Use date locals?
      }
    )(freeSpaces)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTable
