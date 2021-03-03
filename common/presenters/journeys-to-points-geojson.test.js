const journeysToPointsGeoJSON = require('./journeys-to-points-geojson')

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
          longitude: '-0.118092',
          latitude: '51.5074',
        },
        to_location: {
          id: 'DEADBEEF',
          type: 'locations',
          title: 'Edinburgh',
          latitude: '55.9533',
          longitude: '-3.188267',
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
          latitude: '55.9533',
          longitude: '-3.188267',
        },
        to_location: {
          id: 'BAADF00D',
          type: 'locations',
          title: 'Cardiff',
          latitude: '51.4816',
          longitude: '-3.179090',
        },
      },
    ]

    journeysLookup = [
      {
        id: 'DEADD00D',
        type: 'locations',
        title: 'London',
        longitude: '-0.118092',
        latitude: '51.5074',
      },
      {
        id: 'DEADBEEF',
        type: 'locations',
        title: 'Edinburgh',
        latitude: '55.9533',
        longitude: '-3.188267',
      },
      {
        id: 'BAADF00D',
        type: 'locations',
        title: 'Cardiff',
        latitude: '51.4816',
        longitude: '-3.179090',
      },
    ]
  })

  context('with coordinates', function () {
    let result
    beforeEach(function () {
      result = journeysToPointsGeoJSON({ journeys })
    })

    it('should return a FeatureCollection with correct structure', function () {
      expect(result).to.deep.include({
        type: 'FeatureCollection',
      })
      expect(result.features).to.be.an('array')
    })

    it('should return correct number of features, with no duplicates', function () {
      expect(result.features).to.have.lengthOf(3)
    })

    it('should return a FeatureCollection with all locations as points', function () {
      expect(result.features[0]).to.deep.include({
        type: 'Feature',
        id: 'DEADD00D',
        properties: {
          '@id': 'DEADD00D',
          name: 'London',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-0.118092', '51.5074'],
        },
      })

      expect(result.features[1]).to.deep.include({
        type: 'Feature',
        id: 'DEADBEEF',
        properties: {
          '@id': 'DEADBEEF',
          name: 'Edinburgh',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-3.188267', '55.9533'],
        },
      })

      expect(result.features[2]).to.deep.include({
        type: 'Feature',
        id: 'BAADF00D',
        properties: {
          '@id': 'BAADF00D',
          name: 'Cardiff',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-3.179090', '51.4816'],
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

      result = journeysToPointsGeoJSON({
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
      expect(result.features).to.have.lengthOf(3)
    })

    it('should return a FeatureCollection with all locations as points', function () {
      expect(result.features[0]).to.deep.include({
        type: 'Feature',
        id: 'DEADD00D',
        properties: {
          '@id': 'DEADD00D',
          name: 'London',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-0.118092', '51.5074'],
        },
      })

      expect(result.features[1]).to.deep.include({
        type: 'Feature',
        id: 'DEADBEEF',
        properties: {
          '@id': 'DEADBEEF',
          name: 'Edinburgh',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-3.188267', '55.9533'],
        },
      })

      expect(result.features[2]).to.deep.include({
        type: 'Feature',
        id: 'BAADF00D',
        properties: {
          '@id': 'BAADF00D',
          name: 'Cardiff',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-3.179090', '51.4816'],
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

      result = journeysToPointsGeoJSON({
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

    it('should return a FeatureCollection without matched locations', function () {
      expect(result.features[0]).to.deep.include({
        type: 'Feature',
        id: 'DEADD00D',
        properties: {
          '@id': 'DEADD00D',
          name: 'London',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-0.118092', '51.5074'],
        },
      })

      expect(result.features[1]).to.deep.include({
        type: 'Feature',
        id: 'BAADF00D',
        properties: {
          '@id': 'BAADF00D',
          name: 'Cardiff',
        },
        geometry: {
          type: 'Point',
          coordinates: ['-3.179090', '51.4816'],
        },
      })
    })

    it('should return a FeatureCollection without matched locations', function () {})
  })
})
