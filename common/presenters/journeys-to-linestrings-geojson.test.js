const journeysToLineStringsGeoJSON = require('./journeys-to-linestrings-geojson')

describe('journeysToPointsGeoJSON', function () {
  let journeys
  let journeysLookup

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

    journeysLookup = [
      {
        id: 'DEADD00D',
        type: 'locations',
        title: 'London',
        longitude: -0.118092,
        latitude: 51.5074,
      },
      {
        id: 'DEADBEEF',
        type: 'locations',
        title: 'Edinburgh',
        latitude: 55.9533,
        longitude: -3.188267,
      },
      {
        id: 'BAADF00D',
        type: 'locations',
        title: 'Cardiff',
        latitude: 51.4816,
        longitude: -3.17909,
      },
    ]
  })

  context('with coordinates', function () {
    let result
    beforeEach(function () {
      result = journeysToLineStringsGeoJSON({ journeys })
    })

    it('should return a FeatureCollection with correct structure', function () {
      expect(result).to.deep.include({
        type: 'FeatureCollection',
      })
      expect(result.features).to.be.an('array')
    })

    it('should return correct number of features, with no duplicates', function () {
      expect(result.features).to.have.lengthOf(2)
    })

    it('should return a FeatureCollection with all journeys as LineStrings', function () {
      expect(result.features[0]).to.deep.include({
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

      expect(result.features[1]).to.deep.include({
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

  context('with missing coordinates and matching lookup', function () {
    let result
    beforeEach(function () {
      journeys[0].from_location.longitude = ''
      journeys[0].to_location.latitude = ''

      delete journeys[1].from_location.longitude
      delete journeys[1].to_location.latitude

      result = journeysToLineStringsGeoJSON({
        journeys,
        locationLookup: journeysLookup,
      })
    })

    it('should return a FeatureCollection with correct structure', function () {
      expect(result).to.deep.include({
        type: 'FeatureCollection',
      })
      expect(result.features).to.be.an('array')
    })

    it('should return correct number of features, with no duplicates', function () {
      expect(result.features).to.have.lengthOf(2)
    })

    it('should return a FeatureCollection with all journeys as LineStrings', function () {
      expect(result.features[0]).to.deep.include({
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

      expect(result.features[1]).to.deep.include({
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
  context('with missing coordinates and non-matching lookup', function () {
    let result
    beforeEach(function () {
      journeys[0].from_location.longitude = ''
      journeys[0].to_location.latitude = ''

      delete journeys[1].from_location.longitude
      delete journeys[1].to_location.latitude

      delete journeysLookup[1]
    })

    context('with useCentrePointFillIn disabled by default', function () {
      beforeEach(function () {
        result = journeysToLineStringsGeoJSON({
          journeys,
          locationLookup: journeysLookup,
        })
      })

      it('should return a FeatureCollection with correct structure', function () {
        expect(result).to.deep.include({
          type: 'FeatureCollection',
        })
        expect(result.features).to.be.an('array')
      })

      it('should return no partial coordinates', function () {
        expect(result.features).to.have.lengthOf(0)
      })
    })

    context('with useCentrePointFillIn enabled', function () {
      beforeEach(function () {
        result = journeysToLineStringsGeoJSON({
          journeys,
          locationLookup: journeysLookup,
          useCentrePointFillIn: true,
        })
      })

      it('should return a FeatureCollection with correct structure', function () {
        expect(result).to.deep.include({
          type: 'FeatureCollection',
        })
        expect(result.features).to.be.an('array')
      })

      it('should return correct number of features, with no duplicates', function () {
        expect(result.features).to.have.lengthOf(2)
      })

      it('should return a FeatureCollection with all journeys as LineStrings with centrepoint fillins', function () {
        expect(result.features[0]).to.deep.include({
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
              [-2.421976, 53.825564],
            ],
          },
        })

        expect(result.features[1]).to.deep.include({
          type: 'Feature',
          id: 'ABADCAFE',
          properties: {
            '@id': 'ABADCAFE',
            vehicle_registration: 'RAC3R',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-2.421976, 53.825564],
              [-3.17909, 51.4816],
            ],
          },
        })
      })
    })
  })
})
