const restClient = require('../lib/api-client/rest-client')

const BaseService = require('./base')

const perEvents = [
  'PerViolentDangerous',
  'PerWeapons',
  'PerConcealed',
  'PerSelfHarm',
  'PerEscape',
  'PerMedicalAid',
  'PerMedicalDrugsAlcohol',
  'PerMedicalMentalHealth',
  'PerMedicalMedication',
  'PerPropertyChange',
  'PerGeneric',
]

const personMoveEvents = ['PersonMoveUsedForce', 'PersonMoveDeathInCustody']

class EventService extends BaseService {
  async getEvent(req, id) {
    return (await restClient.get(req, `/events/${id}`)).data
  }

  async postEvent(req, eventData) {
    const todaysDate = new Date()

    const payload = {
      data: {
        type: 'events',
        attributes: {
          occurred_at: todaysDate.toISOString(),
          recorded_at: todaysDate.toISOString(),
          notes: '',
          details: eventData.details || {},
          event_type: eventData.type,
        },
        relationships: {
          eventable: {
            data: {
              type: eventData.eventableType,
              id: eventData.eventableId,
            },
          },
          ...eventData.relationships,
        },
      },
    }

    return await restClient.post(req, '/events', payload)
  }

  postLockoutEvents(req, lockoutEvents, move, journeys, user) {
    const todaysDate = new Date()
    const events = []

    events.push(lockoutEvents.events)

    return Promise.all(
      events.flat().map(async event => {
        let type
        let relationshipsId
        let policePersonnelNumber
        let eventableType

        const eventDescription = lockoutEvents[event]

        if (perEvents.includes(event)) {
          type = 'person_escort_records'
          relationshipsId = move.profile.person_escort_record.id
          policePersonnelNumber = 'police_personnel_number'
          eventableType = event
        } else if (personMoveEvents.includes(event)) {
          type = 'moves'
          relationshipsId = move.id
          policePersonnelNumber = 'police_personnel_numbers'
          eventableType = event
        }

        const payload = {
          data: {
            type: 'events',
            attributes: {
              occurred_at: todaysDate.toISOString(),
              recorded_at: todaysDate.toISOString(),
              notes: eventDescription,
              details: {
                [policePersonnelNumber]: [user.username],
                reported_at: todaysDate.toISOString(),
                advised_at: todaysDate.toISOString(),
                advised_by: user.username,
              },
              event_type: eventableType,
            },
            relationships: {
              eventable: {
                data: {
                  type,
                  id: relationshipsId,
                },
              },
              location: {
                data: {
                  id: `${journeys[0].to_location.id}`,
                  type: 'locations',
                },
              },
            },
          },
        }

        return await restClient.post(req, '/events', payload)
      })
    )
  }
}

module.exports = EventService
