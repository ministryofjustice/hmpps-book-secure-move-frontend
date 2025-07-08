import { Allocation } from "./allocation"

export interface SessionModel {
  attributes?: any
  allocation?: Allocation
  reset: () => void
  set: (key: string, value: any) => any
  get: <T>(key: string) => T
  toJSON: () => any
}
