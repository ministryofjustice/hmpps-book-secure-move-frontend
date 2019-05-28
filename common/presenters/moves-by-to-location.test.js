const movesByToLocation = require('./moves-by-to-location')

const { data } = require('../../test/fixtures/api-client/moves.get.deserialized.json')

describe('Presenters', function () {
  describe('#movesByToLocation()', function () {
    context('when provided with mock moves response', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = movesByToLocation(data)
      })

      it('should group the correct number of locations', function () {
        expect(transformedResponse.length).to.equal(5)
      })

      it('should correctly order locations', function () {
        expect(transformedResponse[0].location.description).to.equal('Barnstaple Magistrates Court')
        expect(transformedResponse[0].items.length).to.equal(1)
      })

      it('should correctly order locations', function () {
        expect(transformedResponse[1].location.description).to.equal('Barrow in Furness Magistrates Court')
        expect(transformedResponse[1].items.length).to.equal(2)
      })

      it('should correctly order locations', function () {
        expect(transformedResponse[2].location.description).to.equal('Bedford Magistrates Court')
        expect(transformedResponse[2].items.length).to.equal(1)
      })

      it('should correctly order locations', function () {
        expect(transformedResponse[3].location.description).to.equal('Derby County Court')
        expect(transformedResponse[3].items.length).to.equal(1)
      })

      it('should correctly order locations', function () {
        expect(transformedResponse[4].location.description).to.equal('Wimbledon Crown Court')
        expect(transformedResponse[4].items.length).to.equal(3)
      })
    })
  })
})
