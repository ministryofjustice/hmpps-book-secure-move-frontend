import sinon from 'sinon'
import proxyquire from 'proxyquire'
import { expect } from 'chai'

import { Event } from '../../types/event'

const i18nStub = {
  t: sinon.stub().returnsArg(0),
  exists: sinon.stub().returns(false)
}

const { getDescription } = proxyquire('./get-description', {
  '../../../config/i18n': { default: i18nStub }
})

describe('Helpers', () => {
  beforeEach(() => {
    i18nStub.t.resetHistory()
  })

  describe('Events', () => {
    const mockEvent: Event = {
      id: 'eventId',
      event_type: 'eventType',
      details: {
        journey: { vehicle: { registration: 'fallback reg' } }
      },
      supplier: '12341-12312132'
    }

    describe('#getDescription', () => {
      let description: string

      context('when fetching the description', () => {
        beforeEach(() => {
          i18nStub.t.onFirstCall().returns(' <br><br>description<br>more description')
          description = getDescription(mockEvent)
        })

        it('should get description string', () => {
          expect(i18nStub.t).to.be.calledOnceWithExactly(
            'events::eventType.description',
            mockEvent.details
          )
        })

        it('should strip any leading <br>s and return the description', () => {
          expect(description).to.equal('description<br>more description')
        })

        it('should set vehicle_reg in details', () => {
          expect(mockEvent.details?.vehicle_reg).to.equal(
            mockEvent.details?.journey?.vehicle?.registration
          )
        })
      })
    })
  })
})
