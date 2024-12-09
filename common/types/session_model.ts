import { Allocation } from './allocation'

export interface SessionModel {
  attributes?: any
  allocation?: Allocation
  get: (key: string) => any
  reset: () => void
  set: (key: string, value: any) => any
  toJSON: () => any
}
