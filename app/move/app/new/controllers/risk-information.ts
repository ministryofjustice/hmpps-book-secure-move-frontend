import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'

class RiskInformationController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'risk',
      'No, there are no risks with moving this person',
      'Select if there are risks with moving this person',
    )
  }
}

export default RiskInformationController
