import * as pathToRegexp from 'path-to-regexp'
import { expect } from 'chai'
import sinon from 'sinon'

import { compileFromRoute } from './url'
import { URLRequest } from '../types/url_request'

describe.only('URL Helpers', function () {
  describe('#compileFromRoute()', function () {
    const mockParams = {
      date: '2020-10-10',
      locationId: '12345',
      view: 'requested',
    }
    const mockRoute = `/moves/${mockParams.date}/${mockParams.locationId}`

    let output: string;
    let req: URLRequest
    let matchStub: sinon.SinonStub
    let compileStub: sinon.SinonStub

    before(() => {
      compileStub = sinon.stub(pathToRegexp, 'compile').callsFake(() => {
        return (params: object | undefined) => {
          if (params && 'date' in params) {
            const { date, locationId } = params as { date: string; locationId?: string }
            return `/moves/${date}/${locationId}` ? `/${locationId}` : ''
          }
          return ''
        }
      })
    })

    after(() => {
      sinon.restore();
    });

    beforeEach(() => {
      matchStub = sinon.stub(pathToRegexp, 'match').returns(() => ({
        path: '/base-url/path',
        index: 0,
        params: { ...mockParams },
      }))

      req = {
        baseUrl: '/base-url',
        path: '/path',
        query: {},
        params: {} as Record<string, string | undefined>,
      } as URLRequest
    })

    afterEach(() => {
      matchStub.restore()
    })

    context('with args', function () {

      // context('when no matching route is found', function () {
      //   beforeEach(function () {
      //     // matchStub.returns(null)
      //     output = compileFromRoute(mockRoute, req)
      //     console.log(mockRoute)
      //     console.log('OPUT OPUT:', output)
      //   })

      //   it('should return empty string', function () {
      //     expect(output).to.equal('')
      //   })
      // })

      context('when matching route is found', function () {
        beforeEach(function () {
          output = compileFromRoute(mockRoute, req)
        })

        it('should combine base url and path to find a match', function () {
          expect(matchStub).to.have.been.calledOnceWithExactly(mockRoute)
        })

        it('should call match with the correct route', function () {
          expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(mockRoute)
        })

        it('should call compile with the correct arguments', function () {
          expect(compileStub).to.have.been.calledOnceWithExactly(mockParams)
        })

        it('should return the correct compiled URL', function () {
          expect(output).to.equal(`/moves/${mockParams.date}/${mockParams.locationId}`)
        })
      })
    })
  })
})
