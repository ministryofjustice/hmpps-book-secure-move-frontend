const {
  decorateAsDateTable,
} = require('../../../common/presenters/date-table/date-table-decorator')
const {
  locationsToPopulationAndTransfersTables,
} = require('../../../common/presenters/date-table/locations-to-population-table-component')

function setResultsFreeSpaccesAndTransferTables(req, res, next) {
  try {
    const { dateRange, query } = req

    if (!req.resultsAsPopulation) {
      return next(new Error('missing resultsAsPopulation'))
    }

    const populationAndTransferTables = locationsToPopulationAndTransfersTables(
      {
        query,
        startDate: dateRange[0],
      }
    )(req.resultsAsPopulation)

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

module.exports = setResultsFreeSpaccesAndTransferTables
