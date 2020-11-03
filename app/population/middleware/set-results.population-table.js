const presenters = require('../../../common/presenters')
const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

async function setResultsPopulationTable(req, res, next) {
  try {
    // date range should be a set ... body method?
    const { dateRange, filter } = req

    const freeSpaces = await locationsFreeSpacesService.getPrisonFreeSpaces({
      dateFrom: dateRange[0],
      dateTo: dateRange[1],
      filter,
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
