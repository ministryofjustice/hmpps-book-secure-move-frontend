const nock = require('nock')

const moveService = require('./move')
const { API } = require('../../config')

const movesGetDeserialized = require('../../test/fixtures/api-client/moves.get.deserialized.json')
const movesGetSerialized = require('../../test/fixtures/api-client/moves.get.serialized.json')

describe('Move Service', function () {
  describe('#getMovesByDate()', function () {
    context('when request returns 200', function () {
      const mockDate = '2017-08-10'
      let moves

      beforeEach(async function () {
        this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())

        nock(API.BASE_URL)
          .get('/moves')
          .query({
            filter: {
              date_from: mockDate,
              date_to: mockDate,
            },
          })
          .reply(200, movesGetSerialized)

        moves = await moveService.getMovesByDate(mockDate)
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('should get moves from API with current date', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should contain moves with correct data', function () {
        expect(moves.data).to.deep.equal(movesGetDeserialized.data)
      })
    })
  })
})
