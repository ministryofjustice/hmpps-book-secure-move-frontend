const journeysToGeoJsonLines = require('./journeys-to-geo-json-lines')

describe('Presenters', function () {
  describe('#journeysToGeoJsonLines', function () {
    let journeys
    let result

    beforeEach(function () {
      journeys = [
        {
          id: 'DEADFA11',
          type: 'journeys',
          state: 'completed',
          billable: true,
          vehicle: {
            id: '614',
            fake: true,
            registration: '909 X 101',
          },
          timestamp: '2021-02-23T07:00:00+00:00',
          from_location: {
            id: 'DEADD00D',
            type: 'locations',
            title: 'London',
            longitude: -0.118092,
            latitude: 51.5074,
          },
          to_location: {
            id: 'DEADBEEF',
            type: 'locations',
            title: 'Edinburgh',
            latitude: 55.9533,
            longitude: -3.188267,
          },
        },
        {
          id: 'ABADCAFE',
          type: 'journeys',
          state: 'completed',
          billable: true,
          vehicle: {
            id: '614',
            fake: true,
            registration: 'RAC3R',
          },
          timestamp: '2021-02-23T07:00:00+00:00',
          from_location: {
            id: 'DEADBEEF',
            type: 'locations',
            title: 'Edinburgh',
            latitude: 55.9533,
            longitude: -3.188267,
          },
          to_location: {
            id: 'BAADF00D',
            type: 'locations',
            title: 'Cardiff',
            latitude: 51.4816,
            longitude: -3.17909,
          },
        },
      ]
    })

    context('with coordinates', function () {
      beforeEach(function () {
        result = journeysToGeoJsonLines(journeys)
      })

      it('should return correct structure', function () {
        expect(result).to.be.an('array')
      })

      it('should return correct number of features, with no duplicates', function () {
        expect(result).to.have.lengthOf(2)
      })

      it('should return a FeatureCollection with all journeys as LineStrings', function () {
        expect(result[0]).to.deep.include({
          type: 'Feature',
          id: 'DEADFA11',
          properties: {
            '@id': 'DEADFA11',
            vehicle_registration: '909 X 101',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-0.118092, 51.5074],
              [-3.188267, 55.9533],
            ],
          },
        })

        expect(result[1]).to.deep.include({
          type: 'Feature',
          id: 'ABADCAFE',
          properties: {
            '@id': 'ABADCAFE',
            vehicle_registration: 'RAC3R',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-3.188267, 55.9533],
              [-3.17909, 51.4816],
            ],
          },
        })
      })
    })

    context('with missing to_location coordinates', function () {
      beforeEach(function () {
        delete journeys[0].to_location.longitude

        result = journeysToGeoJsonLines(journeys)
      })

      it('should return correct structure', function () {
        expect(result).to.be.an('array')
      })

      it('should return correct number of features', function () {
        expect(result).to.have.lengthOf(1)
      })

      it('should return a journeys as LineStrings', function () {
        expect(result[0]).to.deep.include({
          type: 'Feature',
          id: 'ABADCAFE',
          properties: {
            '@id': 'ABADCAFE',
            vehicle_registration: 'RAC3R',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-3.188267, 55.9533],
              [-3.17909, 51.4816],
            ],
          },
        })
      })
    })

    context('with missing from_location coordinates', function () {
      beforeEach(function () {
        delete journeys[1].from_location.longitude

        result = journeysToGeoJsonLines(journeys)
      })

      it('should return correct structure', function () {
        expect(result).to.be.an('array')
      })

      it('should return correct number of features', function () {
        expect(result).to.have.lengthOf(1)
      })

      it('should return a journeys as LineStrings', function () {
        expect(result[0]).to.deep.include({
          type: 'Feature',
          id: 'DEADFA11',
          properties: {
            '@id': 'DEADFA11',
            vehicle_registration: '909 X 101',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-0.118092, 51.5074],
              [-3.188267, 55.9533],
            ],
          },
        })
      })
    })
  })
})
