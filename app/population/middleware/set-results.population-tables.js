const {
  decorateAsDateTable,
} = require('../../../common/presenters/date-table/date-table-decorator')
const {
  locationsToPopulationTable,
} = require('../../../common/presenters/date-table/locations-to-population-table-component')

async function setResultsPopulationTables(req, res, next) {
  try {
    const { dateRange, locations, query } = req

    const freeSpaces = await req.services.locationsFreeSpaces.getPrisonFreeSpaces(
      {
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        locationIds: locations?.join(),
      }
    )

    const populationTable = locationsToPopulationTable({
      query,
      startDate: dateRange[0],
    })(freeSpaces)

    req.resultsAsPopulationTables = populationTable.map(groupedPopulation => {
      return decorateAsDateTable({
        focusDate: res.locals.TODAY,
        tableComponent: groupedPopulation,
      })
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulationTables
