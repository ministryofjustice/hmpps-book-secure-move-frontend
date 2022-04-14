const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const restClient = sinon.stub()
restClient.post = sinon.stub()

const EventService = proxyquire('./event', {
  '../lib/api-client/rest-client': restClient,
})

const eventService = new EventService({ apiClient: apiClient })

describe('Event Service', function () {
  describe('#postEvents', function () {
    beforeEach(function () {
      const now = new Date('2022-04-13T10:00:39.986Z')
      sinon.useFakeTimers(now.getTime())
    })

    const perMocklockoutEvents = {
      events: ['PerViolentDangerous'],
      PerViolentDangerous: 'An assault occurred',
      PerWeapons: '',
      PerConcealed: '',
      PerSelfHarm: '',
      PerEscape: '',
      PersonMoveUsedForce: '',
      PerMedicalAid: ['', ''],
      PerMedicalDrugsAlcohol: '',
      PerMedicalMentalHealth: '',
      PerPropertyChange: '',
      PersonMoveDeathInCustody: '',
      PerGeneric: '',
      moveId: '12345-1213144-24343',
    }
    const personMoveMocklockoutEvents = {
      events: ['PersonMoveDeathInCustody'],
      PerViolentDangerous: 'An assault occurred',
      PerWeapons: '',
      PerConcealed: '',
      PerSelfHarm: '',
      PerEscape: '',
      PersonMoveUsedForce: '',
      PerMedicalAid: ['', ''],
      PerMedicalDrugsAlcohol: '',
      PerMedicalMentalHealth: '',
      PerPropertyChange: '',
      PersonMoveDeathInCustody: 'There was a death',
      PerGeneric: '',
      moveId: '12345-1213144-24343',
    }
    const move = {
      id: '12345-1213144-24343',
      type: 'moves',
      from_location: {
        id: '1235-2513453223-423523523',
      },
      profile: {
        person_escort_record: {
          id: '1235-2513453223-423523523',
        },
      },
    }

    const user = { username: 'MRUSERNAME' }

    const mockedPERPayload = {
      data: {
        type: 'events',
        attributes: {
          occurred_at: '2022-04-13T10:00:39.986Z',
          recorded_at: '2022-04-13T10:00:39.986Z',
          notes: 'An assault occurred',
          details: {
            police_personnel_number: ['MRUSERNAME'],
            fault_classification: 'investigation',
            reported_at: '2022-04-13T10:00:39.986Z',
            advised_at: '2022-04-13T10:00:39.986Z',
            advised_by: 'MRUSERNAME',
          },
          event_type: 'PerViolentDangerous',
        },
        relationships: {
          eventable: {
            data: {
              type: 'person_escort_records',
              id: '1235-2513453223-423523523',
            },
          },
          location: {
            data: {
              id: '1235-2513453223-423523523',
              type: 'locations',
            },
          },
        },
      },
    }
    const mockedPersonMovePayload = {
      data: {
        type: 'events',
        attributes: {
          occurred_at: '2022-04-13T10:00:39.986Z',
          recorded_at: '2022-04-13T10:00:39.986Z',
          notes: 'There was a death',
          details: {
            police_personnel_numbers: ['MRUSERNAME'],
            fault_classification: 'investigation',
            reported_at: '2022-04-13T10:00:39.986Z',
            advised_at: '2022-04-13T10:00:39.986Z',
            advised_by: 'MRUSERNAME',
          },
          event_type: 'PersonMoveDeathInCustody',
        },
        relationships: {
          eventable: {
            data: {
              type: 'moves',
              id: '12345-1213144-24343',
            },
          },
          location: {
            data: {
              id: '1235-2513453223-423523523',
              type: 'locations',
            },
          },
        },
      },
    }

    context('with a PER_EVENTS lockout event', function () {
      beforeEach(async function () {
        await eventService.postEvents(perMocklockoutEvents, move, user)
      })

      it('will call the api client /events route by the number of events in mocklockoutEvents.events array', function () {
        expect(restClient.post).to.have.been.calledOnce
      })

      it('will be called with the correct payload for a PER_EVENT', function () {
        expect(restClient.post).to.be.calledWithExactly(
          '/events',
          mockedPERPayload
        )
      })
    })

    context('with a PERSON_MOVE_EVENTS lockout event', function () {
      beforeEach(async function () {
        await eventService.postEvents(personMoveMocklockoutEvents, move, user)
      })

      it('will be called with the correct payload for a PERSON_MOVE_EVENTS', function () {
        expect(restClient.post).to.be.calledWithExactly(
          '/events',
          mockedPersonMovePayload
        )
      })
    })
  })
})
