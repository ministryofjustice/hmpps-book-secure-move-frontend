const middleware = require('./set-assessment')

describe('Framework middleware', function () {
  describe('#setAssessment()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      mockReq = {
        personEscortRecord: {
          id: '__movePER__',
          status: 'not_started',
        },
      }
      nextSpy = sinon.spy()
    })

    context('without key', function () {
      beforeEach(function () {
        middleware()(mockReq, {}, nextSpy)
      })

      it('should set request property to existing property', function () {
        expect(mockReq).to.have.property('assessment')
        expect(mockReq.assessment).to.be.undefined
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with key', function () {
      beforeEach(function () {
        middleware('personEscortRecord')(mockReq, {}, nextSpy)
      })

      it('should set request property to existing property', function () {
        expect(mockReq).to.have.property('assessment')
        expect(mockReq.assessment).to.deep.equal({
          id: '__movePER__',
          status: 'not_started',
        })
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
