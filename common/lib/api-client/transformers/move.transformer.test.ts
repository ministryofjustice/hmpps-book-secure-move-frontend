import { expect } from 'chai'
import sinon from 'sinon'

import i18n from '../../../../config/i18n'
import { GenericEvent } from '../../../types/generic_event'
import { Move } from '../../../types/move'

import { moveTransformer } from './move.transformer'

const baseMove: Move = {
  date: '',
  id: '',
  profile: {
    id: '',
    person: {},
  },
  from_location: {
    id: '',
    key: '',
    title: '',
    type: 'locations',
    location_type: 'court',
  },
  status: 'requested',
  move_type: 'court_appearance',
}

const baseEvent: GenericEvent = {
  id: '',
  event_type: '',
  classification: '',
  occurred_at: '',
  recorded_at: '',
  notes: null,
  created_by: null,
  details: {},
}

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#moveTransformer', function () {
      let move: Move

      describe('when move has timeline events', function () {
        beforeEach(function () {
          move = {
            ...baseMove,
            timeline_events: [
              {
                ...baseEvent,
                id: 'none',
                event_type: 'None',
              },
              {
                ...baseEvent,
                id: 'default',
                classification: 'default',
                event_type: 'Default',
              },
              {
                ...baseEvent,
                id: 'medical',
                classification: 'medical',
                event_type: 'Medical',
              },
              {
                ...baseEvent,
                id: 'incident',
                classification: 'incident',
                event_type: 'Incident',
              },
            ],
          }
          moveTransformer(move)
        })

        it('should copy and filter those events by classification to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              ...baseEvent,
              id: 'medical',
              classification: 'medical',
              event_type: 'Medical',
            },
            {
              ...baseEvent,
              id: 'incident',
              classification: 'incident',
              event_type: 'Incident',
            },
          ])
        })
      })

      describe('when move has has both important and timeline events', function () {
        beforeEach(function () {
          move = {
            ...baseMove,
            timeline_events: [
              {
                ...baseEvent,
                id: 'medical',
                classification: 'medical',
              },
            ],
            important_events: [
              {
                ...baseEvent,
                id: 'foo',
                classification: 'foo',
              },
            ],
          }
          moveTransformer(move)
        })

        it('should leave original important events untouched', function () {
          expect(move.important_events).to.deep.equal([
            {
              ...baseEvent,
              id: 'foo',
              classification: 'foo',
            },
          ])
        })
      })

      describe('when move has important events', function () {
        beforeEach(function () {
          move = {
            ...baseMove,
            important_events: [
              {
                ...baseEvent,
                id: 'foo1',
                event_type: 'foo',
              },
              {
                ...baseEvent,
                id: 'foo2',
                event_type: 'foo',
              },
              {
                ...baseEvent,
                id: 'bar',
                event_type: 'bar',
              },
            ],
          }
          moveTransformer(move)
        })

        it('should add a count to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              ...baseEvent,
              id: 'foo1',
              event_type: 'foo',
              _index: 1,
            },
            {
              ...baseEvent,
              id: 'foo2',
              event_type: 'foo',
              _index: 2,
            },
            {
              ...baseEvent,
              id: 'bar',
              event_type: 'bar',
            },
          ])
        })
      })

      describe('Vehicle registration', function () {
        context('with registration', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              meta: {
                vehicle_registration: 'FM12 AOS',
              },
            }
            moveTransformer(move)
          })

          it('should set vehicle registration property', function () {
            expect(move._vehicleRegistration).to.equal('FM12 AOS')
          })
        })

        context('without registration', function () {
          beforeEach(function () {
            move = { ...baseMove }
            moveTransformer(move)
          })

          it('should not set vehicle registration property', function () {
            expect(move._vehicleRegistration).to.be.undefined
          })
        })

        context('with null registration', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              meta: {
                vehicle_registration: null,
              },
            }
            moveTransformer(move)
          })

          it('should not set vehicle registration property', function () {
            expect(move._vehicleRegistration).to.be.undefined
          })
        })
      })

      describe('Expected times', function () {
        context('with times', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              meta: {
                expected_collection_time: '2020-10-10T12:18:00Z',
                expected_time_of_arrival: '2020-10-10T14:18:00Z',
              },
            }
            moveTransformer(move)
          })

          it('should set time properties', function () {
            expect(move._expectedCollectionTime).to.equal(
              '2020-10-10T12:18:00Z'
            )
            expect(move._expectedArrivalTime).to.equal('2020-10-10T14:18:00Z')
          })
        })

        context('without times', function () {
          beforeEach(function () {
            move = { ...baseMove }
            moveTransformer(move)
          })

          it('should not set time properties', function () {
            expect(move._expectedCollectionTime).to.be.undefined
            expect(move._expectedArrivalTime).to.be.undefined
          })
        })

        context('with null times', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              meta: {
                expected_collection_time: null,
                expected_time_of_arrival: null,
              },
            }
            moveTransformer(move)
          })

          it('should not set time properties', function () {
            expect(move._expectedCollectionTime).to.be.undefined
            expect(move._expectedArrivalTime).to.be.undefined
          })
        })
      })

      describe('Missing to location', function () {
        beforeEach(function () {
          sinon.stub(i18n, 't').returnsArg(0)
        })

        context('with prison recall', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              id: '1',
              move_type: 'prison_recall',
            }
            moveTransformer(move)
          })

          it('should set to location to prison recall label', function () {
            expect(move.to_location).to.deep.equal({
              id: 'unknown',
              key: 'unknown__prison_recall',
              title: 'fields::move_type.items.prison_recall.label',
              location_type: 'prison',
              type: 'locations',
            })
          })
        })

        context('with video remand hearing', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              id: '1',
              move_type: 'video_remand',
            }
            moveTransformer(move)
          })

          it('should set to location to video remand label', function () {
            expect(move.to_location).to.deep.equal({
              id: 'unknown',
              key: 'unknown__video_remand',
              location_type: 'prison',
              title: 'fields::move_type.items.video_remand.label',
              type: 'locations',
            })
          })
        })

        context('with unknown location type', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              id: '1',
              // @ts-ignore
              move_type: 'unknown_type',
            }
            moveTransformer(move)
          })

          it('should set to location to unknown', function () {
            expect(move.to_location).to.deep.equal({
              id: 'unknown',
              key: 'unknown__unknown_type',
              location_type: 'prison',
              title: 'fields::move_type.items.unknown.label',
              type: 'locations',
            })
          })
        })

        context('without to location', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              id: '1',
              move_type: 'court_appearance',
            }
            moveTransformer(move)
          })

          it('should set to location to unknown', function () {
            expect(move.to_location).to.deep.equal({
              id: 'unknown',
              key: 'unknown__court_appearance',
              location_type: 'prison',
              title: 'fields::move_type.items.unknown.label',
              type: 'locations',
            })
          })
        })

        context('with existing to location', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              id: '1',
              move_type: 'court_appearance',
              to_location: {
                id: '031818f0-3b69-4e7a-8b3f-9d51cc964dee',
                type: 'locations',
                key: 'barrow_in_furness_county_court',
                title: 'Barrow in Furness County Court',
                location_type: 'court',
              },
            }
            moveTransformer(move)
          })

          it('should not update to location', function () {
            expect(move.to_location).to.deep.equal({
              id: '031818f0-3b69-4e7a-8b3f-9d51cc964dee',
              type: 'locations',
              key: 'barrow_in_furness_county_court',
              title: 'Barrow in Furness County Court',
              location_type: 'court',
            })
          })
        })
      })

      describe('Extra states', function () {
        const tests = [
          {
            status: 'requested',
            _hasLeftCustody: false,
            _hasArrived: false,
          },
          {
            status: 'booked',
            _hasLeftCustody: false,
            _hasArrived: false,
          },
          {
            status: 'in_transit',
            _hasLeftCustody: true,
            _hasArrived: false,
          },
          {
            status: 'completed',
            _hasLeftCustody: true,
            _hasArrived: true,
          },
          {
            status: 'cancelled',
            _hasLeftCustody: false,
            _hasArrived: false,
          },
        ]

        tests.forEach(test => {
          context(`with ${test.status} move`, function () {
            beforeEach(function () {
              move = {
                ...baseMove,
                status: test.status as any,
              }
              moveTransformer(move)
            })

            it('should mark as not left custody', function () {
              expect(move._hasLeftCustody).to.equal(test._hasLeftCustody)
            })

            it('should mark as not arrived', function () {
              expect(move._hasArrived).to.equal(test._hasArrived)
            })
          })
        })
      })

      describe('MoveLodgingStart and MoveLodgingEnd', function () {
        context('with just MoveLodgingEnd events', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              timeline_events: [
                {
                  ...baseEvent,
                  id: 'end1',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'end2',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
              ],
            }
            moveTransformer(move)
          })

          it('should not add reasons to the events', function () {
            expect(move.timeline_events?.length).to.equal(2)
            move.timeline_events?.forEach(event => {
              expect(event.details?.reason).to.be.undefined
            })
          })
        })

        context('with MoveLodgingStart and MoveLodgingEnd events', function () {
          beforeEach(function () {
            move = {
              ...baseMove,
              timeline_events: [
                {
                  ...baseEvent,
                  id: 'start1',
                  event_type: 'MoveLodgingStart',
                  details: {
                    reason: 'lockout',
                  },
                },
                {
                  ...baseEvent,
                  id: 'end1',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'start2',
                  event_type: 'MoveLodgingStart',
                  details: {
                    reason: 'lockout',
                  },
                },
                {
                  ...baseEvent,
                  id: 'end2',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'end2a',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'start3',
                  event_type: 'MoveLodgingStart',
                  details: {
                    reason: 'overnight_lodging',
                  },
                },
                {
                  ...baseEvent,
                  id: 'end3',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'start4',
                  event_type: 'MoveLodgingStart',
                  details: {
                    reason: 'operation_tornado',
                  },
                },
                {
                  ...baseEvent,
                  id: 'end4',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
                {
                  ...baseEvent,
                  id: 'start5',
                  event_type: 'MoveLodgingStart',
                  details: {
                    reason: 'operation_hmcts',
                  },
                },
                {
                  ...baseEvent,
                  id: 'end5',
                  event_type: 'MoveLodgingEnd',
                  details: {},
                },
              ],
            }
            moveTransformer(move)
          })

          it('should add reasons to the events', function () {
            expect(
              move.timeline_events?.map(event => event.details?.reason)
            ).to.deep.eq([
              'lockout',
              'lockout',
              'lockout',
              'lockout',
              'lockout',
              'overnight_lodging',
              'overnight_lodging',
              'operation_tornado',
              'operation_tornado',
              'operation_hmcts',
              'operation_hmcts',
            ])
          })

          it('correctly adds index', function () {
            expect(move.timeline_events?.map(event => event._index)).to.deep.eq(
              [1, 1, 2, 2, 3, undefined, undefined, 1, 1, 2, 2]
            )
          })
        })
      })
    })
  })
})
