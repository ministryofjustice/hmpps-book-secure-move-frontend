import { mapValues, omitBy, isUndefined } from 'lodash'

import { BaseService } from './base'

const noMoveIdMessage = 'No move ID supplied'
const noLodgingIdMessage = 'No lodging ID supplied'

interface APILodging {
  id: string
  type: 'lodgings'
  attributes: {
    start_date: string
    end_date: string
    status: 'proposed' | 'started' | 'completed' | 'cancelled'
  }
  relationships: {
    move: {
      data: {
        id: string
        type: 'moves'
      }
    }
    location: {
      data: {
        id: string
        type: 'locations'
      }
    }
  }
}

interface IndexParams {
  moveId: string
  filter?: {}
  params?: {}
  combinedData?: APILodging[]
  page?: number
  isAggregation?: boolean
  sort?: {
    by?: string
    direction?: string
  }
}

interface IndexResponse {
  data: APILodging[]
  links: {
    self: string
    first: string
    prev: string | null
    next: string | null
    last: string
  }
  meta: {
    pagination: {
      per_page: number
      total_pages: number
      total_objects: number
    }
  }
}

interface NewParams {
  moveId: string
  locationId: string
  startDate: string
  endDate: string
}

interface NewResponse {
  data: APILodging
}

interface UpdateParams {
  moveId: string
  id: string
  locationId?: string
  startDate?: string
  endDate?: string
}

interface UpdateResponse {
  data: APILodging
}

interface CancelAllParams {
  moveId: string
  reason: string
  comment?: string
}

export class LodgingService extends BaseService {
  constructor(req = {}) {
    super(req)
  }

  format(data: any) {
    const relationships = ['location']

    return mapValues(omitBy(data, isUndefined), (value: any, key: string) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }

      return value
    })
  }

  getAll({
    moveId,
    filter = {},
    params = {},
    combinedData = [],
    page = 1,
    isAggregation = false,
    sort = {},
  }: IndexParams) {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('lodgings')
      .post(
        {
          filter: this.removeInvalid(filter),
        },
        this.removeInvalid({
          ...params,
          page: isAggregation ? 1 : page,
          per_page: isAggregation ? 1 : 100,
          'sort[by]': sort.by,
          'sort[direction]': sort.direction,
        })
      )
      .then((response: IndexResponse) => {
        const { data, links, meta } = response
        const moves = [...combinedData, ...data]

        if (isAggregation) {
          return meta.pagination.total_objects
        }

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return moves
        }

        return this.getAll({
          moveId,
          filter,
          sort,
          combinedData: moves,
          page: page + 1,
          params,
        })
      })
  }

  create({
    moveId,
    locationId,
    startDate,
    endDate,
  }: NewParams): Promise<APILodging> {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('lodging')
      .post({
        start_date: startDate,
        end_date: endDate,
        location: {
          id: locationId,
        },
      })
      .then((response: NewResponse) => response.data)
  }

  update({
    moveId,
    id,
    locationId,
    startDate,
    endDate,
  }: UpdateParams): Promise<APILodging> {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    if (!id) {
      return Promise.reject(new Error(noLodgingIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .one('lodging', id)
      .patch(
        this.format({
          location_id: locationId,
          start_date: startDate,
          end_date: endDate,
        })
      )
      .then((response: UpdateResponse) => response.data)
  }

  cancelAll({ moveId, reason, comment }: CancelAllParams) {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('lodging')
      .all('cancel')
      .post({
        cancellation_reason: reason,
        cancellation_reason_comment: comment,
      })
      .then((response: any) => response)
  }
}
