import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'

class CourtInformationController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'court',
      'No, there is no information for the court',
      'Select if there is any information for the court',
    )
  }
}

export default CourtInformationController
