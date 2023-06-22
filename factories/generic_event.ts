import { Factory } from 'fishery'

import { GenericEvent } from '../common/types/generic_event'

export const GenericEventFactory = Factory.define<GenericEvent>(
  ({ afterBuild }) => {
    afterBuild(obj => {})

    return {
      id: 'id',
      occurred_at: '2023-04-24 17:24:05.709503000 +0100',
      event_type: 'GenericEvent',
      details: {},
    }
  }
)
