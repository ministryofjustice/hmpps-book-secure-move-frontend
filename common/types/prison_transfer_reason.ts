import { ApiObject } from './api_object'

export interface PrisonTransferReason extends ApiObject {
  disabled_at?: string
  key: string
  title: string
}
