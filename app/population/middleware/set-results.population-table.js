const presenters = require('../../../common/presenters')

async function setResultsPopulationTable(req, res, next) {
  try {
    const { dateRange, locations, query } = req

    const freeSpaces = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: locations?.join(),
      }
    )

    req.resultsAsPopulationTable = presenters.locationsToPopulationTableComponent(
      {
        query,
        startDate: dateRange[0],
        focusDate: new Date(), // TODO - Use date locals?
      }
    )(freeSpaces)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTable
