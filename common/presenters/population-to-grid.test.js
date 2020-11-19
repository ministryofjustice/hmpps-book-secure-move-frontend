const populationToGrid = require('./population-to-grid')

describe('Presenters', function () {
  describe('#populationToGrid', function () {
    it('should return an empty object with no population', function () {
      const result = populationToGrid({})
      expect(result).to.deep.equal({})
    })

    it('should return a structured object with full population data', function () {
      const population = {
        date: '2020-03-01',
        free_spaces: 900,
        usable_capacity: 850,
        operational_capacity: 800,
        unlock: 10,
        bedwatch: 20,
        overnights_in: 30,
        overnights_out: 40,
        out_of_area_courts: 50,
        discharges: 60,
      }

      const result = populationToGrid({ population })

      expect(result).to.deep.equal({
        details: {
          free_spaces: population.free_spaces,
          updated_at: population.updated_at,
        },
        totalSpace: [
          {
            property: 'operational_capacity',
            value: population.operational_capacity,
          },
          { property: 'usable_capacity', value: population.usable_capacity },
        ],

        unavailableSpace: [
          { property: 'unlock', value: population.unlock },
          { property: 'bedwatch', value: population.bedwatch },
          { property: 'overnights_in', value: population.overnights_in },
        ],

        availableSpace: [
          { property: 'overnights_out', value: population.overnights_out },
          {
            property: 'out_of_area_courts',
            value: population.out_of_area_courts,
          },
          { property: 'discharges', value: population.discharges },
        ],
      })
    })
  })
})
