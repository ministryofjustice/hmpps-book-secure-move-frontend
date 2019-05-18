const nock = require('nock')

const apiClient = require('./api-client')
const { API } = require('../../config')

const movesGetDeserialized = require('../../test/fixtures/api-client/moves.get.deserialized.json')
const movesGetSerialized = require('../../test/fixtures/api-client/moves.get.serialized.json')

describe('API Client', function () {
  describe('#getMovesByDate()', function () {
    context('when request returns 200', () => {
      const mockDate = '2017-08-10'
      let moves

      beforeEach(async () => {
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

        moves = await apiClient.getMovesByDate(mockDate)
      })

      afterEach(() => {
        this.clock.restore()
      })

      it('should get moves from API with current date', () => {
        expect(nock.isDone()).to.be.true
      })

      it('should contain moves with correct data', function () {
        expect(moves.data).to.deep.equal(movesGetDeserialized.data)
      })
    })
  })
})
