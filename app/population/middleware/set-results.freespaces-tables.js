const {
  decorateAsDateTable,
} = require('../../../common/presenters/date-table/date-table-decorator')
const {
  locationsToPopulationTable,
} = require('../../../common/presenters/date-table/locations-to-population-table-component')

function setResultsPopulationTables(req, res, next) {
  try {
    const { dateRange, query } = req

    if (!req.resultsAsPopulation) {
      return next(new Error('missing resultsAsPopulation'))
    }

    const populationTable = locationsToPopulationTable({
      query,
      startDate: dateRange[0],
    })(req.resultsAsPopulation)

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
