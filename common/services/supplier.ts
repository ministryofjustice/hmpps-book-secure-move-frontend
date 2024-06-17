import { BaseService } from './base'

interface APISupplier {
  id: string
  type: 'suppliers'
  attributes: {
    name: string
    key: string
  }
}

interface IndexParams {
  params?: {}
  combinedData?: APISupplier[]
  page?: number
  isAggregation?: boolean
  sort?: {
    by?: string
    direction?: string
  }
}

interface IndexResponse {
  data: APISupplier[]
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

export class SupplierService extends BaseService {
  constructor(req = {}) {
    super(req)
  }

  getAll({ combinedData = [],
           page = 1,
           sort = {},
         }: IndexParams) {

    return this.apiClient
      .all('supplier')
      .get(
        this.removeInvalid({
          page: page,
          per_page: 100,
          'sort[by]': sort?.by,
          'sort[direction]': sort?.direction,
        })
      )
      .then((response: IndexResponse) => {
        const { data, links, meta } = response
        const suppliers = [...combinedData, ...data]

        const hasNext = links?.next && data.length !== 0

        if (!hasNext) {
          return suppliers
        }

        return this.getAll({
          combinedData: suppliers,
          page: page + 1,
          sort,
        })
      })
  }
}
