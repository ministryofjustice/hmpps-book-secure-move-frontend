import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'
import autoAnswerSpecialVehicle, { hideSpecialVehicleQuestion } from '../../../../../common/helpers/field/auto-answer-special-vehicle'

class HealthInformationController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'health',
      'No, their health doesn’t affect transport',
      'Select if this person’s health affects transport',
    )
  }

  //@ts-ignore
  process(req, res, next) {
    autoAnswerSpecialVehicle(req)
    super.process(req, res, next)
  }

  // @ts-ignore
  render(req, res){
    hideSpecialVehicleQuestion(res)
    super.render(req, res)
  }

}
export default HealthInformationController
