const moveService = require('./move')
const auth = require('../lib/api-client/middleware/auth')
const { API } = require('../../config')

const movesGetDeserialized = require('../../test/fixtures/api-client/moves.get.deserialized.json')
const movesGetSerialized = require('../../test/fixtures/api-client/moves.get.serialized.json')
const moveGetDeserialized = require('../../test/fixtures/api-client/move.get.deserialized.json')
const moveGetSerialized = require('../../test/fixtures/api-client/move.get.serialized.json')

describe('Move Service', function() {
  beforeEach(function() {
    sinon.stub(auth, 'getAccessToken').returns('test')
    sinon
      .stub(auth, 'getAccessTokenExpiry')
      .returns(Math.floor(new Date() / 1000) + 100)
  })

  describe('#format()', function() {
    context('when relationship field is string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: moveGetDeserialized.data.to_location.id,
          from_location: moveGetDeserialized.data.from_location.id,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.to_location).to.deep.equal({
          id: moveGetDeserialized.data.to_location.id,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.from_location).to.deep.equal({
          id: moveGetDeserialized.data.from_location.id,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('when relationship field is not a string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: {
            id: moveGetDeserialized.data.to_location.id,
          },
          from_location: {
            id: moveGetDeserialized.data.from_location.id,
          },
        })
      })

      it('should return its original value', function() {
        expect(formatted.to_location).to.deep.equal({
          id: moveGetDeserialized.data.to_location.id,
        })
      })

      it('should return its original value', function() {
        expect(formatted.from_location).to.deep.equal({
          id: moveGetDeserialized.data.from_location.id,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('with falsey values', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: {
            id: moveGetDeserialized.data.to_location.id,
          },
          from_location: moveGetDeserialized.data.from_location.id,
          empty_string: '',
          false: false,
          undefined: undefined,
          empty_array: [],
        })
      })

      it('should remove falsey values', function() {
        expect(formatted).to.deep.equal({
          date: '2010-10-10',
          to_location: {
            id: moveGetDeserialized.data.to_location.id,
          },
          from_location: {
            id: moveGetDeserialized.data.from_location.id,
          },
          empty_array: [],
        })
      })
    })
  })

  describe('#getRequestedMovesByDateAndLocation()', function() {
    context('when request returns 200', function() {
      const mockDate = '2017-08-10'
      let moves

      beforeEach(async function() {
        this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())

        nock(API.BASE_URL)
          .get('/moves')
          .query({
            per_page: 100,
            filter: {
              status: 'requested',
              date_from: mockDate,
              date_to: mockDate,
            },
          })
          .reply(200, movesGetSerialized)

        moves = await moveService.getRequestedMovesByDateAndLocation(mockDate)
      })

      afterEach(function() {
        this.clock.restore()
      })

      it('should get moves from API with current date', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain moves with correct data', function() {
        expect(moves).to.deep.equal(movesGetDeserialized.data)
      })
    })
  })

  describe('#getMoveById()', function() {
    context('when request returns 200', function() {
      let move

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get(`/moves/${moveGetSerialized.data.id}`)
          .reply(200, moveGetSerialized)

        move = await moveService.getMoveById(moveGetSerialized.data.id)
      })

      it('should get move from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function() {
        expect(move.data).to.deep.equal(moveGetDeserialized.data)
      })
    })
  })

  describe('#create()', function() {
    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        nock(API.BASE_URL)
          .post('/moves')
          .reply(200, moveGetSerialized)

        response = await moveService.create({
          date: '2019-10-10',
          to_location: {
            id: moveGetDeserialized.data.to_location.id,
          },
        })
      })

      it('should get move from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function() {
        expect(response).to.deep.equal(moveGetDeserialized.data)
      })
    })
  })

  describe('#cancel()', function() {
    let mockId

    beforeEach(async function() {
      mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'

      nock(API.BASE_URL)
        .patch(`/moves/${mockId}`)
        .reply(200, moveGetSerialized)
    })

    context('when no ID is supplied in the data object', function() {
      let response

      beforeEach(async function() {
        response = await moveService.cancel()
      })

      it('should not call API', function() {
        expect(nock.isDone()).to.be.false
      })

      it('should return', function() {
        expect(response).to.equal()
      })
    })

    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        response = await moveService.cancel(mockId)
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function() {
        expect(response).to.deep.equal(moveGetDeserialized.data)
      })
    })
  })
})
