import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import * as pathToRegexp from 'path-to-regexp'
import * as helpers from './url'

interface Request {
  baseUrl: string
  path: string
  query: Record<string, any>
  params: Record<string, any>
}

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
    let compileStub: SinonStub, matchStub: SinonStub, req: Request, output: string

    beforeEach(function () {
      matchStub = sinon.stub().returns(false)
      compileStub = sinon.stub().returns('/compiled/url')

      req = {
        baseUrl: '/base-url',
        path: '/path',
        query: {},
        params: {},
      }
    })


    afterEach(function () {
      sinon.restore()
    })

    context('with args', function () {
      context('when no matching route is found', function () {
        beforeEach(function () {
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
            expect(matchStub).to.have.been.calledOnceWithExactly('/base-url/path')
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(mockRoute)
          })

          it('should call compile with correct args', function () {
            expect(compileStub).to.have.been.calledWithExactly(mockMatch.params)
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
            expect(matchStub).to.have.been.calledOnceWithExactly('/base-url/path')
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(mockRoute)
          })

          it('should call compile with overrides', function () {
            expect(compileStub).to.have.been.calledWithExactly({
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
            expect(matchStub).to.have.been.calledOnceWithExactly('/base-url/path')
          })

          it('should call match with route', function () {
            expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(mockRoute)
          })

          it('should call compile with overrides', function () {
            expect(compileStub).to.have.been.calledWithExactly(mockMatch.params)
          })

          it('should return a url with query', function () {
            expect(output).to.equal('/compiled/url?status=approved&foo=bar')
          })
        })

        context('with query overrides', function () {
          beforeEach(function () {
            req.query = {
              status: 'approved',
              foo: 'bar',
            }

            output = helpers.compileFromRoute(
              mockRoute,
              req,
              {},
              {
                foo: 'buzz',
              }
            )
          })

          it('should override the querystring', function () {
            expect(output).to.equal('/compiled/url?status=approved&foo=buzz')
          })
        })
      })
    })
  })
})
