const { set } = require('lodash')

const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')
const referenceDataService = require('../../../../common/services/reference-data')

const CreateAllocationBaseController = require('./base')

class AllocationCriteriaController extends CreateAllocationBaseController {
  async configure(req, res, next) {
    try {
      const allocationComplexCases = await referenceDataService.getAllocationComplexCases()
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

  saveValues(req, res, next) {
    const { complex_cases: complexCases } = req.form.values
    const originalFields = req.form.options.fields.complex_cases.items
    req.form.values.complex_cases = originalFields.map(originalField => {
      const { key, text, value } = originalField
      return {
        allocation_complex_case_id: value,
        answer: complexCases.includes(value),
        key,
        title: text,
      }
    })
    super.saveValues(req, res, next)
  }
}

module.exports = AllocationCriteriaController
