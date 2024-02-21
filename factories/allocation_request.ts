import { Factory } from 'fishery'

import { AllocationRequest } from '../app/allocation/controllers/edit/allocation-details'

import { AllocationFactory } from './allocation'
import { defaultParams } from './basm_request'

export const AllocationRequestFactory = Factory.define<AllocationRequest>(
  () => ({
    ...defaultParams,
    allocation: AllocationFactory.build(),
    flash: (yeah: any, nah: any) => {},
    form: {
      options: {
        fields: {},
        next: '',
      },
      values: {},
    },
  })
)
