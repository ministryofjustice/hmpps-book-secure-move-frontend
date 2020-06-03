const middleware = require('./set-body.moves')

const mockBodyProperty = 'bodyProp'
const mockLocationProperty = 'locationProp'

describe('Moves middleware', function() {
  describe('#setBodyMoves()', function() {
    let mockRes, mockReq, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {
          dateRange: ['2020-10-10', '2020-10-10'],
        },
        session: {
          user: {
            locations: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
          },
        },
      }
    })

    context('with location ID', function() {
      beforeEach(function() {
        mockReq.params.locationId = '7ebc8717-ff5b-4be0-8515-3e308e92700f'
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function() {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          dateRange: ['2020-10-10', '2020-10-10'],
          [mockLocationProperty]: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
        })
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without location ID', function() {
      beforeEach(function() {
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function() {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          dateRange: ['2020-10-10', '2020-10-10'],
          [mockLocationProperty]: '1,2,3,4',
        })
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
