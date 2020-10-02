const presenters = require('../../../common/presenters')
const capacitiesService = require('../../../common/services/capacities')

async function setResultsPopulation(req, res, next) {
  try {
    const capacities = await capacitiesService.getCapacities()
    const query = req.query

    req.capacitiesAsTable = presenters.locationsToPopulationTableComponent({
      query,
    })(capacities)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsPopulation
