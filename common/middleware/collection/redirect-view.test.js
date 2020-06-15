const middleware = require('./redirect-view')

describe('Moves middleware', function () {
  describe('#redirectView()', function () {
    let mockReq, mockRes, nextSpy
    const mockDate = '2017-08-10'
    const mockDefaults = {
      foo: 'week',
    }

    beforeEach(function () {
      this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
      nextSpy = sinon.spy()
      mockReq = {
        baseUrl: '/base/url',
        params: {},
        query: {},
        session: {},
      }
      mockRes = {
        redirect: sinon.stub(),
      }
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('without view', function () {
      beforeEach(function () {
        middleware()(mockReq, mockRes, nextSpy)
      })

      it('should not redirect', function () {
        expect(mockRes.redirect).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with view', function () {
      beforeEach(function () {
        mockReq.params.view = 'foo'
      })

      context('without defaults', function () {
        beforeEach(function () {
          middleware()(mockReq, mockRes, nextSpy)
        })

        it('should redirect with default time period', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            `${mockReq.baseUrl}/day/${mockDate}/foo`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('with defaults', function () {
        context('with default that exists', function () {
          beforeEach(function () {
            middleware(mockDefaults)(mockReq, mockRes, nextSpy)
          })

          it('should redirect with that time period', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly(
              `${mockReq.baseUrl}/week/${mockDate}/foo`
            )
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })
        })

        context('with default that does not exist', function () {
          beforeEach(function () {
            mockReq.params.view = 'bar'
            middleware(mockDefaults)(mockReq, mockRes, nextSpy)
          })

          it('should contain location ID', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly(
              `${mockReq.baseUrl}/day/${mockDate}/bar`
            )
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })
        })
      })

      context('with location', function () {
        beforeEach(function () {
          mockReq.session.currentLocation = {
            id: '12345',
          }
          middleware(mockDefaults)(mockReq, mockRes, nextSpy)
        })

        it('should redirect with that time period', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            `${mockReq.baseUrl}/week/${mockDate}/12345/foo`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('with existing query', function () {
        beforeEach(function () {
          mockReq.query = {
            fizz: 'buzz',
            foo: 'bar',
          }
          middleware(mockDefaults)(mockReq, mockRes, nextSpy)
        })

        it('should contain existing query', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            `${mockReq.baseUrl}/week/${mockDate}/foo?fizz=buzz&foo=bar`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })
  })
})
