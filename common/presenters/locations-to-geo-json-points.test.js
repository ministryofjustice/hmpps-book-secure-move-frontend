const locationsToGeoJsonPoints = require('./locations-to-geo-json-points')

describe('Presenters', function () {
  describe('#locationsToGeoJsonPoints', function () {
    let locations

    beforeEach(function () {
      locations = [
        {
          id: 'ABCDEF',
          type: 'locations',
          title: 'London',
          start: true,
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
          end: true,
          latitude: '53.9533',
          longitude: '-1.188267',
        },
      ]
    })

    context('with coordinates', function () {
      let result

      beforeEach(function () {
        result = locationsToGeoJsonPoints(locations)
      })

      it('should return correct structure', function () {
        expect(result).to.be.an('array')
      })

      it('should return correct number of features', function () {
        expect(result).to.have.lengthOf(3)
      })

      it('should return locations as points', function () {
        expect(result[0]).to.deep.include({
          type: 'Feature',
          id: 'ABCDEF',
          properties: {
            '@id': 'ABCDEF',
            name: 'London',
            isOrigin: true,
            isFinalDestination: false,
          },
          geometry: {
            type: 'Point',
            coordinates: ['-0.118092', '51.5074'],
          },
        })

        expect(result[1]).to.deep.include({
          type: 'Feature',
          id: 'DEADBEEF',
          properties: {
            '@id': 'DEADBEEF',
            name: 'Edinburgh',
            isOrigin: false,
            isFinalDestination: false,
          },
          geometry: {
            type: 'Point',
            coordinates: ['-3.188267', '55.9533'],
          },
        })

        expect(result[2]).to.deep.include({
          type: 'Feature',
          id: 'BAADF00D',
          properties: {
            '@id': 'BAADF00D',
            name: 'Cardiff',
            isOrigin: false,
            isFinalDestination: true,
          },
          geometry: {
            type: 'Point',
            coordinates: ['-1.188267', '53.9533'],
          },
        })
      })
    })

    context('with missing coordinates', function () {
      let result

      beforeEach(function () {
        delete locations[0].longitude
        delete locations[1].latitude

        result = locationsToGeoJsonPoints(locations)
      })

      it('should return correct structure', function () {
        expect(result).to.be.an('array')
      })

      it('should return correct number of features', function () {
        expect(result).to.have.lengthOf(1)
      })

      it('should return a FeatureCollection with all locations as points', function () {
        expect(result[0]).to.deep.include({
          type: 'Feature',
          id: 'BAADF00D',
          properties: {
            '@id': 'BAADF00D',
            name: 'Cardiff',
            isOrigin: false,
            isFinalDestination: true,
          },
          geometry: {
            type: 'Point',
            coordinates: ['-1.188267', '53.9533'],
          },
        })
      })
    })
  })
})
