/* eslint-disable no-unused-vars */

import {
  DataTelemetry,
  EnvelopeTelemetry,
} from 'applicationinsights/out/Declarations/Contracts'
import { expect } from 'chai'

import { addUserDataToRequests, ContextObject } from './azure-appinsights'

const user = {
  activeCaseLoadId: 'LII',
  username: 'test-user',
}

const createEnvelope = (
  properties?: Record<string, string | boolean>,
  baseType = 'RequestData'
) =>
  ({
    data: {
      baseType,
      baseData: { properties },
    } as DataTelemetry,
  } as EnvelopeTelemetry)

const createContext = (username?: string, activeCaseLoadId?: string) =>
  ({
    'http.ServerRequest': {
      res: {
        req: {
          session: {
            currentLocation: {
              nomis_agency_id: activeCaseLoadId,
            },
            user: {
              username,
            },
          },
        },
      },
    },
  } as ContextObject)

const context = createContext(user.username, user.activeCaseLoadId)

// prettier-ignore
describe.skip('azure-appinsights', function () {
  // describe('addUserDataToRequests', function () {
  //   it('adds user data to properties when present', function () {
  //     const envelope = createEnvelope({ other: 'things' })

  //     addUserDataToRequests(envelope, context)

  //     expect(envelope.data.baseData!.properties).to.deep.equal({
  //       ...user,
  //       other: 'things',
  //     })
  //   })

  //   it('handles absent user data', function () {
  //     const envelope = createEnvelope({ other: 'things' })

  //     addUserDataToRequests(
  //       envelope,
  //       createContext(undefined, user.activeCaseLoadId)
  //     )

  //     expect(envelope.data.baseData!.properties).to.deep.equal({
  //       other: 'things',
  //     })
  //   })

  //   it('returns true when not RequestData type', function () {
  //     const envelope = createEnvelope({}, 'NOT_REQUEST_DATA')

  //     const response = addUserDataToRequests(envelope, context)

  //     expect(response).to.equal(true)
  //   })

  //   it('handles when no properties have been set', function () {
  //     const envelope = createEnvelope(undefined)

  //     addUserDataToRequests(envelope, context)

  //     expect(envelope.data.baseData!.properties).to.deep.equal(user)
  //   })

  //   it('handles missing user details', function () {
  //     const envelope = createEnvelope({ other: 'things' })

  //     addUserDataToRequests(envelope, {
  //       'http.ServerRequest': {},
  //     } as ContextObject)

  //     expect(envelope.data.baseData!.properties).to.deep.equal({
  //       other: 'things',
  //     })
  //   })
  // })
})
