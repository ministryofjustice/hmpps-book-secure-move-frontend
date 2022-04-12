const restClient = require('../lib/api-client/rest-client')

const BaseService = require('./base')

class EventService extends BaseService {
  isPerEvent(event) {
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
    return perEvents.includes(event)
  }

  isPersonMoveEvent(event) {
    const personMoveEvents = ['PersonMoveUsedForce', 'PersonMoveDeathInCustody']
    return personMoveEvents.includes(event)
  }

  postEvents(lockoutEvents, move, user) {
    const todaysDate = new Date()
    const events = []

    events.push(lockoutEvents.events)

    events.flat().map(async event => {
      let type
      let relationshipsId
      let supplierPersonnelNumber

      const eventDescription = lockoutEvents[event]

      if (this.isPerEvent(event)) {
        type = 'person_escort_records'
        relationshipsId = move.profile.person_escort_record.id
        supplierPersonnelNumber = 'supplier_personnel_number'
      } else if (this.isPersonMoveEvent(event)) {
        type = 'moves'
        relationshipsId = move.id
        supplierPersonnelNumber = 'supplier_personnel_numbers'
      }

      const payload = {
        data: {
          type: 'events',
          attributes: {
            occurred_at: todaysDate.toISOString(),
            recorded_at: todaysDate.toISOString(),
            notes: eventDescription,
            details: {
              [supplierPersonnelNumber]: [user.username],
              fault_classification: 'investigation',
              reported_at: todaysDate.toISOString(),
              advised_at: todaysDate.toISOString(),
              advised_by: user.username,
            },
            event_type: event,
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
                id: `${move.from_location.id}`,
                type: 'locations',
              },
            },
          },
        },
      }

      const response = await restClient.post('/events', payload)

      return response
    })
  }
}

module.exports = EventService
