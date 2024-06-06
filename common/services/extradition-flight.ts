import { isUndefined, mapValues, omitBy } from 'lodash'

import { BaseService } from './base'

const noMoveIdMessage = 'No move ID supplied'
const noExtraditionFlightIdMessage = 'No ExtraditionFlight ID supplied'

interface APIExtraditionFlight {
  id: string
  type: 'extradition_flight'
  attributes: {
    flight_number: string
    flight_time: string
  }
  relationships: {
    move: {
      data: {
        id: string
        type: 'moves'
      }
    }
  }
}

interface NewParams {
  moveId: string
  flight_number: string
  flight_time: string
}

interface NewResponse {
  data: APIExtraditionFlight
}

interface UpdateParams {
  moveId: string
  id: string
  flight_number?: string
  flight_time?: string
}

interface UpdateResponse {
  data: APIExtraditionFlight
}


export class ExtraditionFlightService extends BaseService {
  constructor(req = {}) {
    super(req)
  }

  format(data: any) {
    return mapValues(omitBy(data, isUndefined), (value: any) => {
      return value
    })
  }

  create({
    moveId,
    flight_time,
    flight_number,
  }: NewParams): Promise<APIExtraditionFlight> {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('extradition_flight')
      .post({
        flight_number: flight_number,
        flight_time: flight_time,
      })
      .then((response: NewResponse) => response.data)
  }

  update({
    moveId,
    id,
    flight_number,
    flight_time,
  }: UpdateParams): Promise<APIExtraditionFlight> {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    if (!id) {
      return Promise.reject(new Error(noExtraditionFlightIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .one('extradition_flight', id)
      .patch(
        this.format({
          flight_number: flight_number,
          flight_time: flight_time,
        })
      )
      .then((response: UpdateResponse) => response.data)
  }

}
