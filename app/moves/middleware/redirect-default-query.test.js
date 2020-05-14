const middleware = require('./redirect-default-query')

describe('Moves middleware', function() {
  describe('#redirectDefaultQuery()', function() {
    let mockReq, mockRes, nextSpy
    const mockDefaults = {
      foo: {
        status: 'approved',
        sortby: 'date',
        sortdir: 'desc',
      },
    }

    beforeEach(function() {
      nextSpy = sinon.spy()
      mockReq = {
        originalUrl: '/original/url',
        params: {},
        query: {},
      }
      mockRes = {
        redirect: sinon.stub(),
      }
    })

    context('without defaults', function() {
      beforeEach(function() {
        middleware()(mockReq, mockRes, nextSpy, 'foo')
      })

      it('should not redirect', function() {
        expect(mockRes.redirect).not.to.be.called
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without defaults', function() {
      context('with default query that exists', function() {
        context('with existing query', function() {
          beforeEach(function() {
            mockReq.query = {
              foo: 'bar',
            }
            middleware(mockDefaults)(mockReq, mockRes, nextSpy, 'foo')
          })

          it('should not redirect', function() {
            expect(mockRes.redirect).not.to.be.called
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('without existing query', function() {
          beforeEach(function() {
            middleware(mockDefaults)(mockReq, mockRes, nextSpy, 'foo')
          })

          it('should redirect', function() {
            expect(mockRes.redirect).to.be.calledOnceWithExactly(
              '/original/url?status=approved&sortby=date&sortdir=desc'
            )
          })

          it('should not call next', function() {
            expect(nextSpy).not.to.be.called
          })
        })
      })

      context('with default query missing', function() {
        context('with existing query', function() {
          beforeEach(function() {
            mockReq.query = {
              foo: 'bar',
            }
            middleware(mockDefaults)(mockReq, mockRes, nextSpy, 'bar')
          })

          it('should not redirect', function() {
            expect(mockRes.redirect).not.to.be.called
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('without existing query', function() {
          beforeEach(function() {
            middleware(mockDefaults)(mockReq, mockRes, nextSpy, 'bar')
          })

          it('should not redirect', function() {
            expect(mockRes.redirect).not.to.be.called
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })
  })
})
