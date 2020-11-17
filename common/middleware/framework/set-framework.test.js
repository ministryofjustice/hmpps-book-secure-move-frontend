const frameworksService = require('../../services/frameworks')

const middleware = require('./set-framework')

describe('Framework middleware', function () {
  describe('#setFramework()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
      sinon.stub(frameworksService, 'getPersonEscortRecord')
    })

    context('without Person Escort Record', function () {
      beforeEach(function () {
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.framework).to.be.undefined
      })

      it('should call next', function () {
        expect(nextSpy).to.be.called.calledOnceWithExactly()
      })
    })

    context('with Person Escort Record', function () {
      beforeEach(function () {
        mockReq.personEscortRecord = {
          version: '1.0.1',
        }
      })

      context('without framework', function () {
        const mockError = new Error('No framework')

        beforeEach(function () {
          frameworksService.getPersonEscortRecord.throws(mockError)
          middleware(mockReq, mockRes, nextSpy)
        })

        it('should not set framework on request', function () {
          expect(mockReq.framework).to.be.undefined
        })

        it('calls next with error', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })

      context('with framework', function () {
        const mockFramework = {
          sections: {
            one: 'bar',
          },
        }

        beforeEach(function () {
          frameworksService.getPersonEscortRecord.returns(mockFramework)
          middleware(mockReq, mockRes, nextSpy)
        })

        it('should ask for correct version', function () {
          expect(
            frameworksService.getPersonEscortRecord
          ).to.be.calledOnceWithExactly('1.0.1')
        })

        it('should set framework on request', function () {
          expect(mockReq.framework).to.deep.equal(mockFramework)
        })

        it('should call next', function () {
          expect(nextSpy).to.be.called.calledOnceWithExactly()
        })
      })
    })
  })
})
