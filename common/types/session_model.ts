import { Allocation } from "./allocation"

export interface SessionModel {
  allocation?: Allocation
  reset: () => void
  set: (key: string, value: any) => any
  toJSON: () => any
}