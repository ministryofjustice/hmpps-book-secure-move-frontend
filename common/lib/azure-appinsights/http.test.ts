import { expect } from 'chai'
import sinon from 'sinon'
import type { IncomingMessage } from 'http'

import { shouldIgnoreIncomingRequest, addUserDataToSpan } from './http'

describe('azure-appinsights/http', function () {
  describe('#shouldIgnoreIncomingRequest()', function () {
    it('ignores healthcheck ping requests', function () {
      const request = { method: 'GET', url: '/healthcheck/ping' } as IncomingMessage

      expect(shouldIgnoreIncomingRequest(request)).to.equal(true)
    })

    it('ignores metrics requests', function () {
      const request = { method: 'GET', url: '/metrics?foo=bar' } as IncomingMessage

      expect(shouldIgnoreIncomingRequest(request)).to.equal(true)
    })

    it('does not ignore other requests', function () {
      const request = { method: 'GET', url: '/moves' } as IncomingMessage

      expect(shouldIgnoreIncomingRequest(request)).to.equal(false)
    })

    it('does not ignore a POST to a healthcheck-like path', function () {
      const request = { method: 'POST', url: '/healthcheck/ping' } as IncomingMessage

      expect(shouldIgnoreIncomingRequest(request)).to.equal(false)
    })
  })

  describe('#addUserDataToSpan()', function () {
    it('adds username and activeCaseLoadId to the span when present', function () {
      const span = { setAttribute: sinon.stub() }
      const request = {
        session: {
          user: { username: 'jbloggs' },
          currentLocation: { nomis_agency_id: 'MDI' },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any

      addUserDataToSpan(span, request)

      expect(span.setAttribute).to.have.been.calledWith('username', 'jbloggs')
      expect(span.setAttribute).to.have.been.calledWith('activeCaseLoadId', 'MDI')
    })

    it('does nothing when there is no session user', function () {
      const span = { setAttribute: sinon.stub() }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request = { session: undefined } as any

      addUserDataToSpan(span, request)

      expect(span.setAttribute).not.to.have.been.called
    })
  })
})
