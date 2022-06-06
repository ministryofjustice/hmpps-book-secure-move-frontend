const i18n = require('../../../../config/i18n').default

const transformer = require('./move.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#moveTransformer', function () {
      let move

      describe('when move has timeline events', function () {
        beforeEach(function () {
          move = {
            timeline_events: [
              {
                id: 'none',
              },
              {
                id: 'default',
                classification: 'default',
              },
              {
                id: 'medical',
                classification: 'medical',
              },
              {
                id: 'incident',
                classification: 'incident',
              },
            ],
          }
          transformer(move)
        })

        it('should copy and filter those events by classification to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'medical',
              classification: 'medical',
            },
            {
              id: 'incident',
              classification: 'incident',
            },
          ])
        })
      })

      describe('when move has has both important and timeline events', function () {
        beforeEach(function () {
          move = {
            timeline_events: [
              {
                id: 'medical',
                classification: 'medical',
              },
            ],
            important_events: [
              {
                id: 'foo',
                classification: 'foo',
              },
            ],
          }
          transformer(move)
        })

        it('should leave original important events untouched', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'foo',
              classification: 'foo',
            },
          ])
        })
      })

      describe('when move has important events', function () {
        beforeEach(function () {
          move = {
            important_events: [
              {
                id: 'foo1',
                event_type: 'foo',
              },
              {
                id: 'foo2',
                event_type: 'foo',
              },
              {
                id: 'bar',
                event_type: 'bar',
              },
            ],
          }
          transformer(move)
        })

        it('should add a count to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'foo1',
              event_type: 'foo',
              _index: 1,
            },
            {
              id: 'foo2',
              event_type: 'foo',
              _index: 2,
            },
            {
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
              meta: {
                vehicle_registration: 'FM12 AOS',
              },
            }
            transformer(move)
          })

          it('should set vehicle registration property', function () {
            expect(move._vehicleRegistration).to.equal('FM12 AOS')
          })
        })

        context('without registration', function () {
          beforeEach(function () {
            move = {}
            transformer(move)
          })

          it('should not set vehicle registration property', function () {
            expect(move._vehicleRegistration).to.be.undefined
          })
        })

        context('with null registration', function () {
          beforeEach(function () {
            move = {
              meta: {
                vehicle_registration: null,
              },
            }
            transformer(move)
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
              meta: {
                expected_collection_time: '2020-10-10T12:18:00Z',
                expected_time_of_arrival: '2020-10-10T14:18:00Z',
              },
            }
            transformer(move)
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
            move = {}
            transformer(move)
          })

          it('should not set time properties', function () {
            expect(move._expectedCollectionTime).to.be.undefined
            expect(move._expectedArrivalTime).to.be.undefined
          })
        })

        context('with null times', function () {
          beforeEach(function () {
            move = {
              meta: {
                expected_collection_time: null,
                expected_time_of_arrival: null,
              },
            }
            transformer(move)
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
              id: '1',
              move_type: 'prison_recall',
            }
            transformer(move)
          })

          it('should set to location to prison recall label', function () {
            expect(move.to_location).to.deep.equal({
              key: 'unknown__prison_recall',
              title: 'fields::move_type.items.prison_recall.label',
            })
          })
        })

        context('with video remand hearing', function () {
          beforeEach(function () {
            move = {
              id: '1',
              move_type: 'video_remand',
            }
            transformer(move)
          })

          it('should set to location to video remand label', function () {
            expect(move.to_location).to.deep.equal({
              key: 'unknown__video_remand',
              title: 'fields::move_type.items.video_remand.label',
            })
          })
        })

        context('with unknown location type', function () {
          beforeEach(function () {
            move = {
              id: '1',
              move_type: 'unknown_type',
            }
            transformer(move)
          })

          it('should set to location to unknown', function () {
            expect(move.to_location).to.deep.equal({
              key: 'unknown__unknown_type',
              title: 'fields::move_type.items.unknown.label',
            })
          })
        })

        context('without to location', function () {
          beforeEach(function () {
            move = {
              id: '1',
              move_type: 'court_appearance',
            }
            transformer(move)
          })

          it('should set to location to unknown', function () {
            expect(move.to_location).to.deep.equal({
              key: 'unknown__court_appearance',
              title: 'fields::move_type.items.unknown.label',
            })
          })
        })

        context('with existing to location', function () {
          beforeEach(function () {
            move = {
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
            transformer(move)
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
                status: test.status,
              }
              transformer(move)
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
    })
  })
})
