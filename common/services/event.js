const restClient = require('../lib/api-client/rest-client')

const BaseService = require('./base')

class EventService extends BaseService {
  async postEvents(lockoutEvents, move, user) {
    const todaysDate = new Date()

    const payload = {
      data: {
        type: 'events',
        attributes: {
          occurred_at: todaysDate.toISOString(),
          recorded_at: todaysDate.toISOString(),
          notes: 'Additional information about this event',
          details: {
            police_personnel_number: user.username,
          },
          event_type: lockoutEvents.events,
        },
        relationships: {
          eventable: {
            data: {
              type: 'person_escort_records',
              id: `${move.profile.person_escort_record.id}`,
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
  }
}

module.exports = EventService
