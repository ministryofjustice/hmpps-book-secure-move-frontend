import FormWizard from 'hmpo-form-wizard'

// import I18n from '../../config/i18n'
import { ApiClient } from '../lib/api-client'
import { EventService } from '../services/event'
import { LodgingService } from '../services/lodging'
import ReferenceDataService from '../services/reference-data'
import { SupplierService } from '../services/supplier'
//
// import { Allocation } from './allocation'
// import { Journey } from './journey'
// import { Lodging } from './lodging'
// import { Move } from './move'
import { Service } from './service'
import { HmppsUser } from './hmpps_user'
// import { SessionModel } from './session_model'

export interface BasmRequest extends FormWizard.Request {
  apiClient: ApiClient
  // body: any
  // allocation?: Allocation
  // canAccess: (permission: string) => boolean
  // flash: (yeah: any, nah: any) => void
  // form?: {
  //   options: {
  //     fields: FormWizard.Fields
  //     next: string
  //     steps?: any
  //     [x: string]: unknown
  //   }
  //   values: { [key: string]: any }
  // }
  // initialStep?: any
  // journeyModel: SessionModel
  // journeys: Journey[]
  // move: Move
  // lodging?: Lodging
  // params: any
  session: {
    save: () => void
    user: HmppsUser
  }
  services: {
    allocation: Service
    event: EventService
    lodging: LodgingService
    referenceData: ReferenceDataService
    supplier: SupplierService
  }
  // t: typeof I18n.t
  // transactionId: string
  // user: {
  //   id: string
  //   permissions: never[]
  //   username: string
  // }
}
