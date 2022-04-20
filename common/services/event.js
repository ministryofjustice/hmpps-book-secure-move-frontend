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
  'PerPropertyChange',
  'PerGeneric',
]

const personMoveEvents = ['PersonMoveUsedForce', 'PersonMoveDeathInCustody']

class EventService extends BaseService {
  postEvents(lockoutEvents, move, user) {
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
        } else if (event === 'PerMedicalAid1' || event === 'PerMedicalAid2') {
          type = 'person_escort_records'
          relationshipsId = move.profile.person_escort_record.id
          policePersonnelNumber = 'police_personnel_number'
          eventableType = 'PerMedicalAid'
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
                fault_classification: 'investigation',
                reported_at: todaysDate.toISOString(),
                advised_at: todaysDate.toISOString(),
                advised_by: user.username,
              },
              event_type: eventableType,
            },
            relationships: {
              eventable: {
                data: {
                  type: type,
                  id: relationshipsId,
                },
              },
              location: {
                data: {
                  id: `${move.to_location.id}`,
                  type: 'locations',
                },
              },
            },
          },
        }

        const response = await restClient.post('/events', payload)

        return response
      })
    )
  }
}

module.exports = EventService
