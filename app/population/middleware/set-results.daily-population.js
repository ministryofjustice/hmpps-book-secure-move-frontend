const populationService = require('../../../common/services/population')

async function setResultsDailyPopulation(req, res, next) {
  try {
    req.transfersIn = [
      {
        establishment: 'Lorem Ipsum',
        count: 5,
      },
      {
        establishment: 'Dolor Sit',
        count: 4,
      },
      {
        establishment: 'Amet',
        count: 10,
      },
    ]

    req.transfersOut = [
      {
        establishment: 'Consequentar',
        count: 3,
      },
      {
        establishment: 'Adipiscing Elit',
        count: 1,
      },
    ]

    const { populationId } = req

    if (!populationId) {
      req.details = {
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

    req.details = {
      date: date,
      free_spaces: freeSpaces,
      updated_at: updatedAt,
    }
    req.totalSpace = [
      { property: 'operational_capacity', value: operationalCapacity },
      { property: 'usable_capacity', value: usableCapacity },
    ]

    req.unavailableSpace = [
      { property: 'unlock', value: unlock },
      { property: 'bedwatch', value: bedwatch },
      { property: 'overnights_in', value: overnightsIn },
    ]

    req.availableSpace = [
      { property: 'overnights_out', value: overnightsOut },
      { property: 'out_of_area_courts', value: outOfAreaCourts },
      { property: 'discharges', value: discharges },
    ]

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsDailyPopulation
