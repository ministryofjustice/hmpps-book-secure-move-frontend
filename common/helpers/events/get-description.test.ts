import { expect } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { Event } from '../../types/event'

const i18nStub = {
  t: sinon.stub().returnsArg(0),
  exists: sinon.stub().returns(false),
}

const { getDescription } = proxyquire('./get-description', {
  '../../../config/i18n': { default: i18nStub },
})

const baseEvent: Event = {
  id: '',
  event_type: '',
  classification: '',
  occurred_at: '',
  recorded_at: '',
  notes: null,
  created_by: null,
  details: {},
}

describe('Helpers', function () {
  beforeEach(function () {
    i18nStub.t.resetHistory()
  })

  describe('Events', function () {
    const mockEvent: Event = {
      ...baseEvent,
      id: 'eventId',
      event_type: 'eventType',
      details: {
        journey: { vehicle: { registration: 'fallback reg' } },
      },
      supplier: '12341-12312132',
    }

    describe('#getDescription', function () {
      let description: string

      context('when fetching the description', function () {
        beforeEach(async function () {
          i18nStub.t
            .onFirstCall()
            .returns(' <br><br>description<br>more description')
          description = await getDescription('token', mockEvent)
        })

        it('should get description string', function () {
          expect(i18nStub.t).to.be.calledOnceWithExactly(
            'events::eventType.description',
            mockEvent.details
          )
        })

        it('should strip any leading <br>s and return the description', function () {
          expect(description).to.equal('description<br>more description')
        })

        it('should set vehicle_reg in details', function () {
          expect(mockEvent.details?.vehicle_reg).to.equal(
            mockEvent.details?.journey?.vehicle?.registration
          )
        })
      })
    })
  })
})
