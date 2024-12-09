import { NextFunction } from 'express'
import { set } from 'lodash'

import { BasmResponse } from '../../../../common/types/basm_response'
import { AllocationRequest } from '../edit/allocation-details'

import CreateAllocationBaseController from './base'

const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')

export default class AllocationCriteriaController extends CreateAllocationBaseController {
  async configure(
    req: AllocationRequest,
    _res: BasmResponse,
    next: NextFunction
  ) {
    try {
      const allocationComplexCases =
        await req.services.referenceData.getAllocationComplexCases()
      const filteredCases = allocationComplexCases
        .filter(referenceDataHelpers.filterDisabled())
        .map(item => {
          return fieldHelpers.mapReferenceDataToOption({
            ...item,
            checked: true,
          })
        })
      set(req, 'form.options.fields.complex_cases.items', filteredCases)
      next()
    } catch (error) {
      next(error)
    }
  }

  saveValues(req: AllocationRequest, res: BasmResponse, next: NextFunction) {
    const {
      complex_cases: complexCases,
      prisoner_adult_male: prisonerMaleCategory,
      prisoner_adult_female: prisonerFemaleCategory,
      prisoner_young_offender_female: prisonerYoungOffenderFemaleCategory,
      prisoner_young_offender_male: prisonerYoungOffenderMaleCategory,
    } = req.form.values
    const originalFields = req.form.options.fields.complex_cases.items || []

    req.form.values.complex_cases = originalFields.map(originalField => {
      const { key, text, value } = originalField
      return {
        key,
        title: text,
        allocation_complex_case_id: value,
        answer: complexCases.includes(value),
      }
    })

    req.form.values.prisoner_category =
      prisonerMaleCategory ||
      prisonerFemaleCategory ||
      prisonerYoungOffenderFemaleCategory ||
      prisonerYoungOffenderMaleCategory ||
      undefined

    super.saveValues(req, res, next)
  }
}
