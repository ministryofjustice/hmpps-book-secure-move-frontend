const pathToRegexp = require('path-to-regexp')

const helpers = require('./url')

describe('URL Helpers', function () {
  describe('#compileFromRoute()', function () {
    const mockRoute = '/moves/:date/:locationId?'
    const mockMatch = {
      params: {
        date: '2020-10-10',
        locationId: '12345',
        view: 'requested',
      },
    }
    let compileStub, matchStub, req, output

    beforeEach(function () {
      matchStub = sinon.stub().returns(false)
      compileStub = sinon.stub().returns('/compiled/url')
      sinon
        .stub(pathToRegexp, 'match')
        .callsFake(() => sinon.stub().returns(false))
      sinon.stub(pathToRegexp, 'compile').callsFake(() => compileStub)

      req = {
        baseUrl: '/base-url',
        path: '/path',
        query: {},
        params: {},
      }
    })

    context('without args', function () {
      beforeEach(function () {
        output = helpers.compileFromRoute()
      })

      it('should return empty string', function () {
        expect(output).to.equal('')
      })
    })

    context('with args', function () {
      context('when no matching route is found', function () {
        beforeEach(function () {
          pathToRegexp.match.callsFake(() => sinon.stub().returns(false))

          output = helpers.compileFromRoute(mockRoute, req)
        })

        it('should return empty string', function () {
          expect(output).to.equal('')
        })
      })

      context('when matching route is found', function () {
        beforeEach(function () {
          matchStub = sinon.stub().returns(mockMatch)
          pathToRegexp.match.callsFake(() => matchStub)
        })

        context('by default', function () {
          beforeEach(function () {
            output = helpers.compileFromRoute(mockRoute, req)
          })

          it('should combine base url and path to find a match', function () {
            expect(matchStub).to.have.been.calledOnceWithExactly(
              '/base-url/path'
            )
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(
              mockRoute
            )
          })

          it('should call compile with correct args', function () {
            expect(compileStub).to.be.calledWithExactly(mockMatch.params)
          })

          it('should return a url', function () {
            expect(output).to.equal('/compiled/url')
          })
        })

        context('with overrides', function () {
          beforeEach(function () {
            output = helpers.compileFromRoute(mockRoute, req, {
              date: '2018-01-01',
              foo: 'bar',
            })
          })

          it('should combine base url and path to find a match', function () {
            expect(matchStub).to.have.been.calledOnceWithExactly(
              '/base-url/path'
            )
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(
              mockRoute
            )
          })

          it('should call compile with overrides', function () {
            expect(compileStub).to.be.calledWithExactly({
              ...mockMatch.params,
              date: '2018-01-01',
              foo: 'bar',
            })
          })

          it('should return a url', function () {
            expect(output).to.equal('/compiled/url')
          })
        })

        context('with query', function () {
          beforeEach(function () {
            req.query = {
              status: 'approved',
              foo: 'bar',
            }

            output = helpers.compileFromRoute(mockRoute, req)
          })

          it('should combine base url and path to find a match', function () {
            expect(matchStub).to.have.been.calledOnceWithExactly(
              '/base-url/path'
            )
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(
              mockRoute
            )
          })

          it('should call compile with overrides', function () {
            expect(compileStub).to.be.calledWithExactly(mockMatch.params)
          })

          it('should return a url with query', function () {
            expect(output).to.equal('/compiled/url?foo=bar&status=approved')
          })
        })
      })
    })
  })
})
