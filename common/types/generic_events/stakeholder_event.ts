import { GenericEvent } from '../generic_event'

export interface StakeholderEvent extends GenericEvent {
  stakeholder_group: string
  event_date: string
  event_time: string
  event_summary: string
  further_details: string
}
