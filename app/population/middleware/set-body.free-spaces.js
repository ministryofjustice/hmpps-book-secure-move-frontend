const populationService = require('../../../common/services/population')

async function setBodyFreeSpaces(req, res, next) {
  try {
    const { populationId } = req.body.population

    if (!populationId) {
      req.body.population.freeSpaces = {
        date: req.params.date,
      }
      return next()
    }

    const {
      date,
      operational_capacity: operationalCapacity,
      usable_capacity: usableCapacity,
      unlock,
      bedwatch,
      overnights_in: overnightsIn,
      overnights_out: overnightsOut,
      out_of_area_courts: outOfAreaCourts,
      discharges,
      free_spaces: freeSpaces,
      updated_at: updatedAt,
    } = await populationService.getById(populationId)

    req.body.population.freeSpaces = {
      date,
      freeSpaces: freeSpaces,
      updatedAt: updatedAt,
      operationalCapacity: operationalCapacity,
      usableCapacity: usableCapacity,
      unlock: unlock,
      bedwatch: bedwatch,
      overnightsIn: overnightsIn,
      overnightsOut: overnightsOut,
      outOfAreaCourts: outOfAreaCourts,
      discharges: discharges,
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setBodyFreeSpaces
