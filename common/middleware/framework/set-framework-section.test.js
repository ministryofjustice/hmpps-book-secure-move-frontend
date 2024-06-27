const middleware = require('./set-framework-section')

describe('Framework middleware', function () {
  describe('#setFrameworkSection()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
    })

    context('without framework', function () {
      beforeEach(function () {
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.frameworkSection).to.be.undefined
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Framework section not found')
        expect(error.statusCode).to.equal(404)
      })
    })

    context('with framework', function () {
      beforeEach(function () {
        mockReq.assessment = {
          sections: {
            foo: {
              name: 'bar',
            },
          },
        }
      })

      context('with section', function () {
        beforeEach(function () {
          middleware(mockReq, mockRes, nextSpy, 'foo')
        })

        it('should set framework on request', function () {
          expect(mockReq.frameworkSection).to.deep.equal({
            name: 'bar',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.called.calledOnceWithExactly()
        })
      })

      context('without section', function () {
        beforeEach(function () {
          middleware(mockReq, mockRes, nextSpy, 'bar')
        })

        it('should not set framework on request', function () {
          expect(mockReq.frameworkSection).to.be.undefined
        })

        it('should call next with 404 error', function () {
          const error = nextSpy.args[0][0]

          expect(nextSpy).to.be.calledOnce

          expect(error).to.be.an('error')
          expect(error.message).to.equal('Framework section not found')
          expect(error.statusCode).to.equal(404)
        })
      })
    })
  })
})
