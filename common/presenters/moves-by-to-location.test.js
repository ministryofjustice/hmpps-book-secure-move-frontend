const movesByToLocation = require('./moves-by-to-location')

const {
  data,
} = require('../../test/fixtures/api-client/moves.get.deserialized.json')

describe('Presenters', function() {
  describe('#movesByToLocation()', function() {
    context('when provided with mock moves response', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = movesByToLocation(data)
      })

      it('should contain correct number of locations', function() {
        expect(transformedResponse.length).to.equal(3)
      })

      describe('location order', function() {
        it('should order correctly', function() {
          expect(transformedResponse[0].location.title).to.equal(
            'Axminster Crown Court'
          )
        })

        it('should order correctly', function() {
          expect(transformedResponse[1].location.title).to.equal(
            'Barnstaple Magistrates Court'
          )
        })

        it('should order correctly', function() {
          expect(transformedResponse[2].location.title).to.equal(
            'Barrow in Furness County Court'
          )
        })
      })

      describe('location count', function() {
        it('should contain correct number of moves', function() {
          expect(transformedResponse[0].items.length).to.equal(10)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[1].items.length).to.equal(5)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[2].items.length).to.equal(5)
        })
      })
    })
  })
})
