const dateHelpers = require('../../../common/helpers/date')

const middleware = require('./set-body.moves')

const mockBodyProperty = 'bodyProp'
const mockLocationProperty = 'locationProp'

describe('Moves middleware', function () {
  describe('#setBodyMoves()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      sinon
        .stub(dateHelpers, 'getCurrentDayAsRange')
        .returns('#currentDayAsRange')
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        locations: ['1', '2', '3'],
        params: {},
        query: {},
      }
    })

    context('with status query', function () {
      beforeEach(function () {
        mockReq.query.status = 'complete'
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          status: 'complete',
          dateRange: '#currentDayAsRange',
          [mockLocationProperty]: mockReq.locations,
          supplierId: undefined,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with location', function () {
      beforeEach(function () {
        mockReq.location = {
          id: '1',
        }
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          dateRange: '#currentDayAsRange',
          [mockLocationProperty]: ['1'],
          supplierId: undefined,
          status: undefined,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with dateRange param', function () {
      beforeEach(function () {
        mockReq.params.dateRange = ['2020-10-10', '2020-10-10']
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          dateRange: ['2020-10-10', '2020-10-10'],
          [mockLocationProperty]: mockReq.locations,
          supplierId: undefined,
          status: undefined,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without dateRange param', function () {
      beforeEach(function () {
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReq,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body[mockBodyProperty]).to.deep.equal({
          dateRange: '#currentDayAsRange',
          [mockLocationProperty]: mockReq.locations,
          supplierId: undefined,
          status: undefined,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with supplier id', function () {
      let mockReqWithSupplierId
      beforeEach(function () {
        mockReqWithSupplierId = {
          ...mockReq,
          session: {
            user: {
              supplierId: '#supplier',
            },
          },
        }
        middleware(mockBodyProperty, mockLocationProperty)(
          mockReqWithSupplierId,
          mockRes,
          nextSpy
        )
      })

      it('should assign req.body correctly', function () {
        expect(mockReqWithSupplierId.body[mockBodyProperty]).to.deep.equal({
          dateRange: '#currentDayAsRange',
          [mockLocationProperty]: mockReq.locations,
          supplierId: '#supplier',
          status: undefined,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
