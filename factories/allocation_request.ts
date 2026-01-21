import { Factory } from 'fishery'

import { AllocationRequest } from '../app/allocation/controllers/edit/base'

import { AllocationFactory } from './allocation'
import { defaultParams } from './basm_request'

export const AllocationRequestFactory = Factory.define<AllocationRequest>(
  () => ({
    ...defaultParams,
    allocation: AllocationFactory.build(),
    flash: (key: any, value: any) => {},
    form: {
      options: {
        fields: {},
        next: '',
      },
      values: {},
    },
  })
)
