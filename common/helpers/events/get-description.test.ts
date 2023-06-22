import { expect } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { GenericEventFactory } from '../../../factories/generic_event'
import { LocationFactory } from '../../../factories/location'
import { GenericEvent } from '../../types/generic_event'
import { Location } from '../../types/location'

const i18nStub = {
  t: sinon.stub().returnsArg(0),
  exists: sinon.stub().returns(false),
}

const { getDescription } = proxyquire('./get-description', {
  '../../../config/i18n': { default: i18nStub },
  '../../services/user': {
    getFullName: (_token: string, name: string) => name.toUpperCase(),
  },
})

describe('Helpers', function () {
  beforeEach(function () {
    i18nStub.t.resetHistory()
  })

  describe('Events', function () {
    let mockEvent: GenericEvent

    describe('#getDescription', function () {
      let description: string

      context('when fetching the description', function () {
        beforeEach(async function () {
          mockEvent = GenericEventFactory.build({
            id: 'eventId',
            event_type: 'eventType',
            details: {
              journey: {
                from_location: LocationFactory.build(),
                to_location: LocationFactory.build(),
                vehicle: { registration: 'fallback reg' },
              },
            },
            supplier: '12341-12312132',
            occurred_at: '2020-10-10T14:00:00Z',
          })
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

      context('when the event is PerCompletion', function () {
        beforeEach(function () {
          mockEvent = GenericEventFactory.build({
            id: 'eventId',
            event_type: 'PerCompletion',
            details: {},
            supplier: '12341-12312132',
            occurred_at: '2020-10-10T14:00:00Z',
          })
          i18nStub.t
            .onFirstCall()
            .returns(' <br><br>description<br>more description')
        })

        context(
          'when event.details.responded_by is an invalid value',
          function () {
            ;[null, '', 'test'].forEach(function (value) {
              context(`value: ${value}`, function () {
                beforeEach(async function () {
                  mockEvent.details.responded_by = value as any
                  description = await getDescription('token', mockEvent)
                })

                it(`sets the section fields to blank`, function () {
                  expect(mockEvent.details.riskUsers).to.equal('')
                  expect(mockEvent.details.offenceUsers).to.equal('')
                  expect(mockEvent.details.healthUsers).to.equal('')
                  expect(mockEvent.details.propertyUsers).to.equal('')
                })
              })
            })
          }
        )

        context(
          'when event.details.responded_by is a valid value',
          function () {
            beforeEach(async function () {
              mockEvent.details.responded_by = {
                'risk-information': ['riskUser'],
                'offence-information': ['offenceUser', 'offenceUser2'],
                'health-information': ['healthUser', 'healthUser2'],
                'property-information': [
                  'propertyUser',
                  'propertyUser2',
                  'propertyUser3',
                ],
              }
              description = await getDescription('token', mockEvent)
            })

            it(`sets the section fields to the expected values`, function () {
              expect(mockEvent.details.riskUsers).to.equal('by RISKUSER')
              expect(mockEvent.details.offenceUsers).to.equal(
                'by OFFENCEUSER and OFFENCEUSER2'
              )
              expect(mockEvent.details.healthUsers).to.equal(
                'by HEALTHUSER and HEALTHUSER2'
              )
              expect(mockEvent.details.propertyUsers).to.equal(
                'by PROPERTYUSER, PROPERTYUSER2 and PROPERTYUSER3'
              )
            })
          }
        )
      })

      context('when the event is PerUpdated', function () {
        beforeEach(function () {
          mockEvent = GenericEventFactory.build({
            id: 'eventId',
            event_type: 'PerUpdated',
            details: {},
            supplier: '12341-12312132',
            occurred_at: '2020-10-10T14:00:00Z',
          })
          i18nStub.t
            .onFirstCall()
            .returns(' <br><br>description<br>more description')
        })

        context(
          'when event.details.responded_by is an invalid value',
          function () {
            ;[null, ['abc', '123'], 123].forEach(function (value) {
              context(`value: ${value}`, function () {
                beforeEach(async function () {
                  mockEvent.details.responded_by = value as any
                  description = await getDescription('token', mockEvent)
                })

                it(`sets the updateAuthor field to blank`, function () {
                  expect(mockEvent.details.updateAuthor).to.equal('')
                })
              })
            })
          }
        )

        context(
          'when event.details.responded_by is a valid value',
          function () {
            beforeEach(async function () {
              mockEvent.details.responded_by = 'user'
              description = await getDescription('token', mockEvent)
            })

            it(`sets the updateAuthor field to the expected value`, function () {
              expect(mockEvent.details.updateAuthor).to.equal('by USER')
            })
          }
        )

        context('when event.details.section is an invalid value', function () {
          ;[null, ['abc', '123'], 123, 'some-other-section'].forEach(function (
            value
          ) {
            context(`value: ${value}`, function () {
              beforeEach(async function () {
                mockEvent.details.section = value as any
                description = await getDescription('token', mockEvent)
              })

              it(`sets the updateSection field to 'Updated'`, function () {
                expect(mockEvent.details.updateSection).to.equal('Updated')
              })
            })
          })
        })

        context('when event.details.section is a valid value', function () {
          ;[
            { key: 'health-information', formatted: 'Health information' },
            { key: 'offence-information', formatted: 'Offence information' },
            { key: 'property-information', formatted: 'Property information' },
            { key: 'risk-information', formatted: 'Risk information' },
          ].forEach(function (value) {
            context(`value: ${value.key}`, function () {
              beforeEach(async function () {
                mockEvent.details.section = value.key as any
                description = await getDescription('token', mockEvent)
              })

              it(`sets the updateSection field to '${value.formatted} updated'`, function () {
                expect(mockEvent.details.updateSection).to.equal(
                  `${value.formatted} updated`
                )
              })
            })
          })
        })
      })
      context('when the event is MoveOvernightLodge', function () {
        context('when the lodge is only 1 night long', function () {
          beforeEach(async function () {
            mockEvent = GenericEventFactory.build({
              id: 'eventId',
              event_type: 'MoveOvernightLodge',
              details: {
                start_date: '2020-02-02',
                end_date: '2020-02-03',
              },
              supplier: '12341-12312132',
              occurred_at: '2020-10-10T14:00:00Z',
            })
            description = await getDescription('token', mockEvent)
          })

          it('does not set the context', function () {
            expect(mockEvent.details.context).to.equal(undefined)
          })
        })
        context('when the lodge is more than 1 night long', function () {
          beforeEach(async function () {
            mockEvent = GenericEventFactory.build({
              id: 'eventId',
              event_type: 'MoveOvernightLodge',
              details: {
                start_date: '2020-02-02',
                end_date: '2020-02-04',
              },
              supplier: '12341-12312132',
              occurred_at: '2020-10-10T14:00:00Z',
            })
            description = await getDescription('token', mockEvent)
          })

          it(`does sets the context to 'long'`, function () {
            expect(mockEvent.details.context).to.equal('long')
          })
        })
      })
      context('when the event has no supplier', function () {
        beforeEach(async function () {
          mockEvent = GenericEventFactory.build({
            id: 'eventId',
            event_type: 'something else',
            details: {},
            supplier: null,
            occurred_at: '2020-10-10T14:00:00Z',
          })
          description = await getDescription('token', mockEvent)
        })

        it(`sets the context field to 'without_supplier'`, function () {
          expect(mockEvent.details.context).to.equal(`without_supplier`)
        })
      })
    })
  })
})
