import { User } from '@sentry/node'

// @ts-ignore // TODO: convert to TS
import restClient from '../lib/api-client/rest-client'
import { BasmRequest } from '../types/basm_request'
import { EventDetails } from '../types/event-details'
import { Journey } from '../types/journey'
import { Move } from '../types/move'

import { BaseService } from './base'

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

interface PostEventData {
  eventableType: 'moves'
  eventableId: string
  type: string
  details?: EventDetails
  relationships?: { [key: string]: { data: { id: string; type: string } } }
}

type LockoutEventType =
  | 'PerViolentDangerous'
  | 'PerWeapons'
  | 'PerConcealed'
  | 'PerSelfHarm'
  | 'PerEscape'
  | 'PerMedicalAid'
  | 'PerMedicalDrugsAlcohol'
  | 'PerMedicalMentalHealth'
  | 'PerMedicalMedication'
  | 'PerPropertyChange'
  | 'PerGeneric'
  | 'PersonMoveUsedForce'
  | 'PersonMoveDeathInCustody'

interface PostLockoutEventsData {
  moveId: string
  events: LockoutEventType[]
  PerViolentDangerous: string
  PerWeapons: string
  PerConcealed: string
  PerSelfHarm: string
  PerEscape: string
  PerMedicalAid: string[]
  PerMedicalDrugsAlcohol: string
  PerMedicalMentalHealth: string
  PerMedicalMedication: string
  PerPropertyChange: string
  PerGeneric: string
  PersonMoveUsedForce: string
  PersonMoveDeathInCustody: string
}

export class EventService extends BaseService {
  async getEvent(req: BasmRequest, id: string) {
    return (await restClient.get(req, `/events/${id}`)).data
  }

  async postEvent(req: BasmRequest, eventData: PostEventData) {
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

  postLockoutEvents(
    req: BasmRequest,
    lockoutEvents: PostLockoutEventsData,
    move: Move,
    journeys: Journey[],
    user: User
  ) {
    const todaysDate = new Date()
    const events = []

    events.push(lockoutEvents.events)

    return Promise.all(
      events.flat().map(async event => {
        let type
        let relationshipsId
        let policePersonnelNumber:
          | 'police_personnel_number'
          | 'police_personnel_numbers'
        let eventableType

        const eventDescription = lockoutEvents[event]

        if (perEvents.includes(event)) {
          type = 'person_escort_records'
          relationshipsId = move.profile?.person_escort_record?.id
          policePersonnelNumber = 'police_personnel_number'
          eventableType = event
        } else if (personMoveEvents.includes(event)) {
          type = 'moves'
          relationshipsId = move.id
          policePersonnelNumber = 'police_personnel_numbers'
          eventableType = event
        } else {
          throw Error(`Unsupported event type: ${event}`)
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
