declare module 'devour-client' {
  import { Allocation } from '../../../types/allocation'
  import { AllocationComplexCase } from '../../../types/allocation_complex_case'
  import { AssessmentQuestion } from '../../../types/assessment_question'
  import { Ethnicity } from '../../../types/ethnicity'
  import { Gender } from '../../../types/gender'
  import { Location } from '../../../types/location'
  import { Middleware } from '../../../types/middleware'
  import { PrisonTransferReason } from '../../../types/prison_transfer_reason'
  import { Region } from '../../../types/region'
  import { Supplier } from '../../../types/supplier'

  type DevourResponse<ResponseType extends object> = Promise<{
    data: ResponseType
    links: {
      self: string
      first: string
      prev: string | null
      next: string | null
      last: string
    }
  }>

  interface DevourChain<ReturnType> {
    all(action?: string): DevourChain<ReturnType>

    get(): DevourResponse<ReturnType>
    post(args?: object): DevourResponse<ReturnType>
  }

  class JsonApi {
    constructor(opts: {
      apiUrl: string
      middleware?: Middleware[]
      logger?: boolean
      pluralize?: (thing: string) => boolean | false
      resetBuilderOnCall?: boolean
      auth?: { username: string; password: string }
      bearer?: string
      trailingSlash?: { resource?: boolean; collection?: boolean }
    })

    create(
      modelName: 'allocation',
      data: {
        moves_count: string
        from_location: string
        to_location: string
        date: string
        estate: string
        sentence_length?: string
        complex_cases: string
        complete_in_full?: string
        has_other_criteria: boolean
        other_criteria?: string
      }
    ): Promise<Allocation>

    define(modelName: string, modelFields: any, modelOptions: any)

    find(
      modelName: 'location',
      id: string,
      params?: object
    ): DevourResponse<Location>

    find(
      modelName: 'region',
      id: string,
      params?: object
    ): DevourResponse<Region>

    find(
      modelName: 'supplier',
      id: string,
      params?: object
    ): DevourResponse<Supplier>

    findAll(
      modelName: 'assessment_question',
      params?: object
    ): DevourResponse<AssessmentQuestion[]>

    findAll(
      modelName: 'ethnicity',
      params?: object
    ): DevourResponse<Ethnicity[]>

    findAll(
      modelName: 'allocation_complex_case',
      params?: object
    ): DevourResponse<AllocationComplexCase[]>

    findAll(modelName: 'gender', params?: object): DevourResponse<Gender[]>
    findAll(modelName: 'location', params?: object): DevourResponse<Location[]>
    findAll(
      modelName: 'prison_transfer_reason',
      params?: object
    ): DevourResponse<PrisonTransferReason[]>

    findAll(modelName: 'region', params?: object): DevourResponse<Region[]>
    findAll(modelName: 'supplier', params?: object): DevourResponse<Supplier[]>

    insertMiddlewareBefore(name: string, middleware: Middleware)

    one(modelName: 'allocation', id: string): DevourChain<Allocation>

    replaceMiddleware(name: string, middleware: Middleware)
  }

  export default JsonApi
}
