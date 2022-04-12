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
    const mocklockoutEvents = {
      events: ['PerViolentDangerous', 'PerPropertyChange'],
      PerViolentDangerous: 'An assault occurred ',
      PerWeapons: '',
      PerConcealed: '',
      PerSelfHarm: '',
      PerEscape: '',
      PersonMoveUsedForce: '',
      PerMedicalAid: ['', ''],
      PerMedicalDrugsAlcohol: '',
      PerMedicalMentalHealth: '',
      PerPropertyChange: 'Has had a property change',
      PersonMoveDeathInCustody: '',
      PerGeneric: '',
      moveId: '12345-1213144-24343',
    }
    const move = {
      id: '1235-2513453223-423523523',
      type: 'moves',
      from_location: {
        id: '1235-2513453223-423523523',
      },
      profile: {
        person_escort_record: {
          id: '1235-2513453223-423523523',
          type: 'person_escort_records',
        },
      },
    }

    const user = { username: 'MRUSERNAME' }

    context('with lockout events', function () {
      beforeEach(async function () {
        await eventService.postEvents(mocklockoutEvents, move, user)
      })

      it('will call the api client /events route by the number of events in mocklockoutEvents.events array', function () {
        expect(restClient.post).to.have.been.calledTwice
      })
    })
  })
})
