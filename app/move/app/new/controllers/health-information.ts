import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'

class HealthInformationController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'health',
      'No, their health doesn’t affect transport',
      'Select if this person’s health affects transport',
    )
  }
}
export default HealthInformationController
