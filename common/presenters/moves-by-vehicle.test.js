const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')
const moveToCardComponentStub = sinon
  .stub()
  .callsFake(() => sinon.stub().returnsArg(0))
const movesByVehicle = proxyquire('./moves-by-vehicle', {
  './move-to-card-component': moveToCardComponentStub,
})

describe('Presenters', function () {
  describe('#movesByVehicle()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      moveToCardComponentStub.resetHistory()
    })

    context('without moves', function () {
      it('should return empty array', function () {
        const moves = movesByVehicle()
        expect(moves).to.deep.equal([])
      })
    })

    context('with moves', function () {
      let output

      describe('grouping', function () {
        const mockMoves = [
          {
            id: 'id_1',
          },
          {
            id: 'id_2',
            _vehicleRegistration: 'GH12 AUQ',
          },
          {
            id: 'id_3',
            _vehicleRegistration: 'BD19 OGS',
          },
          {
            id: 'id_4',
          },
          {
            id: 'id_5',
            _vehicleRegistration: 'BD19 OGS',
          },
          {
            id: 'id_6',
            _vehicleRegistration: 'LM45 AMA',
          },
          {
            id: 'id_6',
            _vehicleRegistration: 'BD19 OGS',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves })
        })

        it('should contain correct number of groups', function () {
          expect(output).to.have.length(4)
        })

        it('should return correct groups', function () {
          const registrations = output.map(group => group.vehicleRegistration)
          expect(registrations).to.deep.equal([
            'BD19 OGS',
            'GH12 AUQ',
            'LM45 AMA',
            undefined,
          ])
        })

        it('should return correct number in each group', function () {
          const items = output.map(group => group.items.length)
          expect(items).to.deep.equal([3, 1, 1, 2])
        })

        it('should return correct items for each group', function () {
          const items = output.map(group => group.items.map(move => move.id))
          expect(items).to.deep.equal([
            ['id_3', 'id_5', 'id_6'],
            ['id_2'],
            ['id_6'],
            ['id_1', 'id_4'],
          ])
        })

        describe('headers', function () {
          it('should set vehicle registration header', function () {
            expect(
              output.every(
                group =>
                  group.header[0].label ===
                  'collections::labels.vehicle_registration'
              )
            ).to.be.true

            expect(
              output.every(
                group =>
                  group.header[0].classes === 'govuk-grid-column-one-quarter'
              )
            ).to.be.true

            const items = output.map(group => group.header[0].value)
            expect(items).to.deep.equal([
              'BD19 OGS',
              'GH12 AUQ',
              'LM45 AMA',
              'collections::labels.awaiting_vehicle',
            ])
          })

          it('should set expected time header', function () {
            expect(
              output.every(
                group =>
                  group.header[1].label === 'collections::labels.expected_time'
              )
            ).to.be.true

            expect(
              output.every(
                group =>
                  group.header[1].classes === 'govuk-grid-column-one-half'
              )
            ).to.be.true

            const items = output.map(group => group.header[1].value)
            expect(items).to.deep.equal([
              'collections::labels.no_expected_time',
              'collections::labels.no_expected_time',
              'collections::labels.no_expected_time',
              'collections::labels.no_expected_time',
            ])
          })

          it('should set people header', function () {
            expect(
              output.every(group => group.header[2].label === 'people')
            ).to.be.true

            expect(
              output.every(
                group =>
                  group.header[2].classes === 'govuk-grid-column-one-quarter'
              )
            ).to.be.true

            const items = output.map(group => group.header[2].value)
            expect(items).to.deep.equal([3, 1, 1, 2])
          })
        })
      })

      describe('group ordering', function () {
        context('with outgoing context', function () {
          const mockMoves = [
            {
              id: 'id_1',
              _vehicleRegistration: 'XT19 GQM',
            },
            {
              id: 'id_2',
              _vehicleRegistration: 'GH12 AUQ',
            },
            {
              id: 'id_3',
              _vehicleRegistration: 'LM45 AMA',
              _hasLeftCustody: true,
              _expectedCollectionTime: '2019-10-10T16:00:00Z',
            },
            {
              id: 'id_4',
            },
            {
              id: 'id_5',
              _vehicleRegistration: 'BD19 OGS',
              _hasLeftCustody: true,
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_6',
              _vehicleRegistration: 'LM45 AMA',
              _hasLeftCustody: true,
              _expectedCollectionTime: '2019-10-10T16:00:00Z',
            },
            {
              id: 'id_7',
              _vehicleRegistration: 'BD19 OGS',
              _hasLeftCustody: true,
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_8',
              _vehicleRegistration: 'AY16 PAM',
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_9',
              _vehicleRegistration: 'IQ20 RNA',
              _expectedCollectionTime: '2019-10-10T10:00:00Z',
            },
          ]

          beforeEach(function () {
            output = movesByVehicle({ moves: mockMoves })
          })

          it('should order groups correctly', function () {
            const registrations = output.map(group => group.vehicleRegistration)
            expect(registrations).to.deep.equal([
              'IQ20 RNA',
              'AY16 PAM',
              'GH12 AUQ',
              'XT19 GQM',
              undefined,
              'BD19 OGS',
              'LM45 AMA',
            ])
          })
        })

        context('with incoming context', function () {
          const mockMoves = [
            {
              id: 'id_1',
              _vehicleRegistration: 'XT19 GQM',
            },
            {
              id: 'id_2',
              _vehicleRegistration: 'GH12 AUQ',
            },
            {
              id: 'id_3',
              _vehicleRegistration: 'LM45 AMA',
              _hasArrived: true,
              _expectedCollectionTime: '2019-10-10T16:00:00Z',
            },
            {
              id: 'id_4',
            },
            {
              id: 'id_5',
              _vehicleRegistration: 'BD19 OGS',
              _hasArrived: true,
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_6',
              _vehicleRegistration: 'LM45 AMA',
              _hasArrived: false,
              _expectedCollectionTime: '2019-10-10T16:00:00Z',
            },
            {
              id: 'id_7',
              _vehicleRegistration: 'BD19 OGS',
              _hasArrived: true,
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_8',
              _vehicleRegistration: 'AY16 PAM',
              _expectedCollectionTime: '2019-10-10T14:00:00Z',
            },
            {
              id: 'id_9',
              _vehicleRegistration: 'IQ20 RNA',
              _expectedCollectionTime: '2019-10-10T10:00:00Z',
            },
          ]

          beforeEach(function () {
            output = movesByVehicle({ moves: mockMoves, context: 'incoming' })
          })

          it('should order groups correctly', function () {
            const registrations = output.map(group => group.vehicleRegistration)
            expect(registrations).to.deep.equal([
              'AY16 PAM',
              'GH12 AUQ',
              'IQ20 RNA',
              'LM45 AMA',
              'XT19 GQM',
              undefined,
              'BD19 OGS',
            ])
          })
        })
      })

      context('with outgoing context', function () {
        const mockMoves = [
          {
            id: 'id_1',
            _hasLeftCustody: true,
            _hasArrived: false,
            _expectedCollectionTime: '2020-10-10T10:50:00Z',
            _expectedArrivalTime: '2020-10-10T13:30:00Z',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves, context: 'outgoing' })
        })

        it('should call presenter with both locations enabled', function () {
          expect(moveToCardComponentStub).to.be.calledWithExactly({
            showToLocation: true,
            showFromLocation: false,
            locationType: undefined,
          })
        })

        it('should use correct time property', function () {
          expect(output[0].expectedTime).to.equal('2020-10-10T10:50:00Z')
        })

        it('should set complete correctly', function () {
          expect(output[0].isComplete).to.be.true
        })
      })

      context('with incoming context', function () {
        const mockMoves = [
          {
            id: 'id_1',
            _hasLeftCustody: true,
            _hasArrived: false,
            _expectedCollectionTime: '2020-10-10T10:50:00Z',
            _expectedArrivalTime: '2020-10-10T13:30:00Z',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves, context: 'incoming' })
        })

        it('should call presenter with both locations enabled', function () {
          expect(moveToCardComponentStub).to.be.calledWithExactly({
            showToLocation: false,
            showFromLocation: true,
            locationType: undefined,
          })
        })

        it('should use correct time property', function () {
          expect(output[0].expectedTime).to.equal('2020-10-10T13:30:00Z')
        })

        it('should set complete correctly', function () {
          expect(output[0].isComplete).to.be.false
        })
      })

      context('with show locations enabled', function () {
        const mockMoves = [
          {
            id: 'id_1',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves, showLocations: true })
        })

        it('should call presenter with both locations enabled', function () {
          expect(moveToCardComponentStub).to.be.calledWithExactly({
            showToLocation: true,
            showFromLocation: true,
            locationType: undefined,
          })
        })
      })

      context('with no vehicle registration', function () {
        const mockMoves = [
          {
            id: 'id_1',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves })
        })

        it('should set group with undefined vehicle registration', function () {
          expect(output[0].vehicleRegistration).to.be.undefined
        })

        it('should use fallback for vehicle header', function () {
          const items = output.map(group => group.header[0].value)
          expect(items).to.deep.equal(['collections::labels.awaiting_vehicle'])
        })
      })

      describe('move ordering', function () {
        const mockMoves = [
          {
            id: 'id_1',
            profile: {
              person: {
                _fullname: 'SMITH, JOHN',
              },
            },
          },
          {
            id: 'id_2',
            profile: {
              person: {
                _fullname: 'MILLAR, PAUL',
              },
            },
          },
          {
            id: 'id_3',
            profile: {
              person: {
                _fullname: 'STEVENS, ANDREW',
              },
            },
          },
          {
            id: 'id_4',
            profile: {
              person: {
                _fullname: 'DOE, JANE',
              },
            },
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves })
        })

        it('should order moves by name', function () {
          const items = output.map(group => group.items.map(move => move.id))
          expect(items).to.deep.equal([['id_4', 'id_2', 'id_1', 'id_3']])
        })
      })

      describe('expected time', function () {
        const mockMoves = [
          {
            id: 'id_1',
            _expectedCollectionTime: '2020-10-10T14:00:00',
          },
          {
            id: 'id_2',
            _expectedCollectionTime: '2020-10-10T15:00:00',
          },
          {
            id: 'id_3',
            _expectedCollectionTime: '2020-10-10T10:00:00',
          },
        ]

        beforeEach(function () {
          output = movesByVehicle({ moves: mockMoves })
        })

        it('should set expected time to earliest', function () {
          expect(output[0].expectedTime).to.equal('2020-10-10T10:00:00')
        })

        it('should set expected time in label', function () {
          const items = output.map(group => group.header[1].value)
          expect(items).to.deep.equal(['appTime'])
        })

        it('should call correct set of components', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appTime',
            {
              datetime: '2020-10-10T10:00:00',
              text: '2020-10-10T10:00:00',
            }
          )
        })
      })

      describe('relative time', function () {
        context('when today', function () {
          let clock

          beforeEach(function () {
            const now = new Date('2020-10-10T15:09:00Z')
            clock = sinon.useFakeTimers(now.getTime())
          })

          afterEach(function () {
            clock.restore()
          })

          context('when moves are not complete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _expectedCollectionTime: '2020-10-10T14:00:00',
                _hasLeftCustody: false,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should set expected time in label', function () {
              const items = output.map(group => group.header[1].value)
              expect(items).to.deep.equal(['appTimeappTime'])
            })

            it('should call correct set of components', function () {
              expect(componentService.getComponent).to.be.calledTwice
              expect(
                componentService.getComponent.getCall(0)
              ).to.be.calledWithExactly('appTime', {
                datetime: '2020-10-10T14:00:00',
                text: '2020-10-10T14:00:00',
              })
              expect(
                componentService.getComponent.getCall(1)
              ).to.be.calledWithExactly('appTime', {
                datetime: '2020-10-10T14:00:00',
                text: '2020-10-10T14:00:00',
                relative: true,
                displayAsTag: true,
                imminentOffset: 60,
              })
            })
          })

          context('when moves are complete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _expectedCollectionTime: '2020-10-10T14:00:00',
                _hasLeftCustody: true,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should set expected time in label', function () {
              const items = output.map(group => group.header[1].value)
              expect(items).to.deep.equal(['appTimegovukTag'])
            })

            it('should call correct set of components', function () {
              expect(componentService.getComponent).to.be.calledTwice
              expect(
                componentService.getComponent.getCall(0)
              ).to.be.calledWithExactly('appTime', {
                datetime: '2020-10-10T14:00:00',
                text: '2020-10-10T14:00:00',
              })
              expect(
                componentService.getComponent.getCall(1)
              ).to.be.calledWithExactly('govukTag', {
                html: 'collections::labels.complete',
                classes: 'govuk-tag--green',
              })
            })
          })
        })

        context('when not today', function () {
          let clock

          beforeEach(function () {
            const now = new Date('2020-10-05T15:09:00Z')
            clock = sinon.useFakeTimers(now.getTime())
          })

          afterEach(function () {
            clock.restore()
          })

          context('when moves are not complete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _expectedCollectionTime: '2020-10-10T14:00:00',
                _hasLeftCustody: false,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should set expected time in label', function () {
              const items = output.map(group => group.header[1].value)
              expect(items).to.deep.equal(['appTime'])
            })

            it('should call correct set of components', function () {
              expect(componentService.getComponent).to.be.calledOnceWithExactly(
                'appTime',
                {
                  datetime: '2020-10-10T14:00:00',
                  text: '2020-10-10T14:00:00',
                }
              )
            })
          })

          context('when moves are complete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _expectedCollectionTime: '2020-10-10T14:00:00',
                _hasLeftCustody: true,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should set expected time in label', function () {
              const items = output.map(group => group.header[1].value)
              expect(items).to.deep.equal(['appTimegovukTag'])
            })

            it('should call correct set of components', function () {
              expect(componentService.getComponent).to.be.calledTwice
              expect(
                componentService.getComponent.getCall(0)
              ).to.be.calledWithExactly('appTime', {
                datetime: '2020-10-10T14:00:00',
                text: '2020-10-10T14:00:00',
              })
              expect(
                componentService.getComponent.getCall(1)
              ).to.be.calledWithExactly('govukTag', {
                html: 'collections::labels.complete',
                classes: 'govuk-tag--green',
              })
            })
          })
        })
      })

      describe('complete moves', function () {
        context('with outgoing context', function () {
          context('with all complete moves', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _hasLeftCustody: true,
              },
              {
                id: 'id_2',
                _hasLeftCustody: true,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should mark group as complete', function () {
              expect(output[0].isComplete).to.be.true
            })
          })

          context('with some incomplete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _hasLeftCustody: true,
              },
              {
                id: 'id_2',
                _hasLeftCustody: false,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves })
            })

            it('should not mark group as complete', function () {
              expect(output[0].isComplete).to.be.false
            })
          })
        })

        context('with incoming context', function () {
          context('with all complete moves', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _hasArrived: true,
              },
              {
                id: 'id_2',
                _hasArrived: true,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves, context: 'incoming' })
            })

            it('should mark group as complete', function () {
              expect(output[0].isComplete).to.be.true
            })
          })

          context('with some incomplete', function () {
            const mockMoves = [
              {
                id: 'id_1',
                _hasArrived: true,
              },
              {
                id: 'id_2',
                _hasArrived: false,
              },
            ]

            beforeEach(function () {
              output = movesByVehicle({ moves: mockMoves, context: 'incoming' })
            })

            it('should not mark group as complete', function () {
              expect(output[0].isComplete).to.be.false
            })
          })
        })
      })
    })
  })
})
