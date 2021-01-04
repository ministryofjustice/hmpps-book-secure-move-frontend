const {
  decorateAsDateTable,
} = require('../../../common/presenters/date-table/date-table-decorator')
const {
  locationsToPopulationAndTransfersTables,
} = require('../../../common/presenters/date-table/locations-to-population-table-component')

async function setResultsPopulationTable(req, res, next) {
  try {
    const { dateRange, locations, locationId, query } = req

    const freeSpaces = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: locationId || locations?.join(),
      }
    )

    const populationAndTransferTables = locationsToPopulationAndTransfersTables(
      {
        query,
        startDate: dateRange[0],
      }
    )(freeSpaces)

    req.resultsAsPopulationTables = populationAndTransferTables.map(
      groupedPopulation => {
        return decorateAsDateTable({
          focusDate: res.locals.TODAY,
          tableComponent: groupedPopulation,
        })
      }
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTable
