// @ts-expect-error TODO: convert to TS
import AssessmentController from './assessment'
import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'

class UpdateHealthController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'health',
      'No, their health doesn’t affect transport',
      'Select if this person’s health affects transport',
    )
  }
}

export default UpdateHealthController
